import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'admin@aiudaanbootcamp.com'
const ADMIN_PASSWORD = 'Admin@aiudaan123'

// CORS headers for production domain
const getCORSHeaders = () => {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', 'https://aiudaanbootcamp.com')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, x-admin-email, x-admin-password')
  headers.set('Access-Control-Max-Age', '86400')
  return headers
}

// Handle preflight requests
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCORSHeaders(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      const response = NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Validate credentials locally first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({
        success: true,
        message: 'Login successful'
      })
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Fallback: Check authentication with Moodle's token.php service
    try {
      const moodleUrl = (process.env.MOODLE_URL || '').replace(/\/+$/, '');
      if (moodleUrl) {
        // Moodle Mobile App service name is standard on all Moodle sites for login token generation
        const url = `${moodleUrl}/login/token.php?username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&service=moodle_mobile_app`;
        
        console.log(`🔒 Authenticating "${email}" against Moodle token service...`);
        const moodleRes = await fetch(url, {
          method: 'POST',
          cache: 'no-store'
        });

        if (moodleRes.ok) {
          const authData = await moodleRes.json();
          if (authData.token) {
            console.log(`✅ Moodle login succeeded for: ${email}`);
            const response = NextResponse.json({
              success: true,
              message: 'Login successful via Moodle auth',
              moodleToken: authData.token
            });
            const corsHeaders = getCORSHeaders();
            corsHeaders.forEach((value, key) => {
              response.headers.set(key, value);
            });
            return response;
          } else if (authData.error) {
            console.warn(`⚠️ Moodle login failed: ${authData.error}`);
          }
        }
      }
    } catch (moodleAuthErr: any) {
      console.error('❌ Moodle authentication server request failed:', moodleAuthErr.message);
    }

    const response = NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value)
    })
    return response
  } catch (error) {
    console.error('Login error:', error)
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value)
    })
    return response
  }
}
