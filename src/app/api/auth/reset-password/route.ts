import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const supabase = await createAuthClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      if (error.message?.includes('session') || error.message?.includes('token')) {
        return NextResponse.json(
          { error: 'link_expired' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: error.message || 'An error occurred. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
