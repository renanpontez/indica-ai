import { NextResponse } from 'next/server';
import { createAuthClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createAuthClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`);

      // Set a short-lived cookie for password recovery flow
      // so the auth layout allows the authenticated user through
      if (next.includes('reset-password')) {
        response.cookies.set('password_recovery', 'true', {
          maxAge: 600,
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
        });
      }

      return response;
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?error=OAuthCallbackError`);
}
