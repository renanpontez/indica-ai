import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, display_name } = await request.json();

    // Validation
    if (!email || !password || !display_name) {
      return NextResponse.json(
        { error: 'Email, password, and display name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (display_name.length < 2) {
      return NextResponse.json(
        { error: 'Display name must be at least 2 characters' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: display_name,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Check if email confirmation is required (user exists but no session)
    if (data.user && !data.session) {
      return NextResponse.json({
        success: true,
        requiresEmailConfirmation: true,
        message: 'Please check your email to confirm your account',
      });
    }

    // If we have a session, user is already signed in
    if (data.session) {
      return NextResponse.json({ success: true, user: data.user });
    }

    // Fallback: explicitly sign in the user after signup
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      return NextResponse.json({
        success: true,
        requiresSignIn: true,
        message: 'Account created. Please sign in.',
      });
    }

    return NextResponse.json({ success: true, user: signInData.user });
  } catch {
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
