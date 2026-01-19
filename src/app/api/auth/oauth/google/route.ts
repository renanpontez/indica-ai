import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirectTo') || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const supabase = await createAuthClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/error?error=OAuthSignin`
    );
  }

  // Redirect to Google OAuth
  return NextResponse.redirect(data.url);
}
