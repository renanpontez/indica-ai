import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignUpRequest, AuthUser } from '@/lib/models';

const MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

export async function POST(request: NextRequest) {
  try {
    const body: SignUpRequest = await request.json();
    const { email, password, display_name, username } = body;

    // Validation
    if (!email || !password || !display_name || !username) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (MOCK_MODE) {
      // Mock sign up for development
      const mockUser: AuthUser = {
        id: `user-${Date.now()}`,
        email,
        display_name,
        username,
        avatar_url: null,
        provider: 'email',
        created_at: new Date().toISOString(),
      };

      return NextResponse.json({
        user: mockUser,
        message: 'Account created successfully',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Real API call to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: hashedPassword,
          display_name,
          username,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || 'Failed to create account' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
