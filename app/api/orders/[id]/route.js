import { NextResponse } from 'next/server';

async function fetchPaymentById(paymentId) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch order ${paymentId}`);
  }

  return response.json();
}

function parsePaymentStatus(status) {
  if (status === 'captured') return 'Paid';
  if (status === 'authorized' || status === 'created') return 'Pending';
  return 'Failed';
}

// GET /api/orders/[id]
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const payment = await fetchPaymentById(id);
    const notes = payment.notes || {};

    return NextResponse.json({
      success: true,
      data: {
        id: payment.id,
        orderId: payment.order_id || payment.id,
        studentName: notes.student_name || notes.student || 'N/A',
        studentEmail: notes.student_email || notes.email || 'N/A',
        courseName: notes.course_name || 'N/A',
        amount: Number((Number(payment.amount || 0) / 100).toFixed(2)),
        paymentStatus: parsePaymentStatus(payment.status),
        paymentMethod: payment.method || 'Razorpay',
        orderDate: new Date(Number(payment.created_at || 0) * 1000).toISOString(),
        transactionId: payment.id,
      },
      message: 'Order fetched successfully',
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - No-op placeholder (Razorpay payment records are immutable)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    return NextResponse.json({
      success: true,
      data: { id, ...body },
      message: 'Order update acknowledged (read-only payment source)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - No-op placeholder
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    return NextResponse.json({
      success: true,
      message: `Order ${id} deletion acknowledged (external source)` ,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}
