import { NextResponse } from 'next/server';

function parsePaymentStatus(status) {
  if (status === 'captured') return 'Paid';
  if (status === 'authorized' || status === 'created') return 'Pending';
  return 'Failed';
}

function toReadableDate(unixSeconds) {
  return new Date(Number(unixSeconds || 0) * 1000).toISOString();
}

function toDisplayAmount(paise) {
  return Number((Number(paise || 0) / 100).toFixed(2));
}

async function fetchRazorpayPayments() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

  const allPayments = [];
  const pageSize = 100;
  let skip = 0;
  let rounds = 0;

  while (rounds < 20) {
    const response = await fetch(`https://api.razorpay.com/v1/payments?count=${pageSize}&skip=${skip}`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Razorpay API failed with status ${response.status}`);
    }

    const data = await response.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    allPayments.push(...items);

    if (items.length < pageSize) break;

    skip += pageSize;
    rounds += 1;
  }

  return allPayments;
}

// GET /api/orders - Fetch all orders from Razorpay
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentStatus = (searchParams.get('paymentStatus') || 'all').toLowerCase();
    const searchQuery = (searchParams.get('search') || '').trim().toLowerCase();

    const payments = await fetchRazorpayPayments();

    const orders = payments.map((payment) => {
      const notes = payment.notes || {};

      return {
        id: payment.id,
        orderId: payment.order_id || payment.id,
        studentName: notes.student_name || notes.student || 'N/A',
        studentEmail: notes.student_email || notes.email || 'N/A',
        courseName: notes.course_name || 'N/A',
        courseId: notes.course_id || null,
        amount: toDisplayAmount(payment.amount),
        paymentStatus: parsePaymentStatus(payment.status),
        paymentMethod: payment.method || 'Razorpay',
        orderDate: toReadableDate(payment.created_at),
        paymentDate: toReadableDate(payment.created_at),
        transactionId: payment.id,
      };
    });

    let filteredOrders = [...orders];

    if (paymentStatus !== 'all') {
      filteredOrders = filteredOrders.filter(
        (order) => order.paymentStatus.toLowerCase() === paymentStatus
      );
    }

    if (searchQuery) {
      filteredOrders = filteredOrders.filter((order) =>
        order.studentName.toLowerCase().includes(searchQuery) ||
        order.studentEmail.toLowerCase().includes(searchQuery) ||
        order.courseName.toLowerCase().includes(searchQuery) ||
        String(order.id).toLowerCase().includes(searchQuery)
      );
    }

    filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    const totalRevenue = filteredOrders
      .filter((order) => order.paymentStatus === 'Paid')
      .reduce((sum, order) => sum + Number(order.amount || 0), 0);

    return NextResponse.json({
      success: true,
      data: filteredOrders,
      total: filteredOrders.length,
      totalRevenue,
      message: 'Orders fetched successfully',
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - passthrough for custom order records if needed
export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json(
      {
        success: true,
        data: {
          id: body.transactionId || `manual_${Date.now()}`,
          ...body,
          orderDate: body.orderDate || new Date().toISOString(),
        },
        message: 'Order record accepted',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
