import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createAuthClient();

    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/reset-password`;

    await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    // Always return success to avoid leaking whether email exists
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
