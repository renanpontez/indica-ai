import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthUser } from '@/lib/models';

// This will be replaced with actual backend API calls
const MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          if (MOCK_MODE) {
            // Mock authentication for development
            const mockUser: AuthUser = {
              id: 'mock-user-1',
              email: credentials.email,
              display_name: credentials.email.split('@')[0],
              username: credentials.email.split('@')[0],
              avatar_url: null,
              provider: 'email',
              created_at: new Date().toISOString(),
            };
            return mockUser as any;
          }

          // Real API call
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signin`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error('Invalid credentials');
          }

          const data = await response.json();
          return data.user;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          if (MOCK_MODE) {
            // In mock mode, allow sign in
            return true;
          }

          // Send Google user to backend for account creation/linking
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                google_id: user.id,
                email: user.email,
                display_name: user.name,
                avatar_url: user.image,
              }),
            }
          );

          if (!response.ok) {
            return false;
          }

          const data = await response.json();
          user.id = data.user.id;
          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.display_name = (user as any).display_name || user.name;
        token.username = (user as any).username || user.email?.split('@')[0];
        token.avatar_url = (user as any).avatar_url || user.image;
        const provider = account?.provider;
        token.provider = (provider === 'google' || provider === 'credentials')
          ? (provider === 'credentials' ? 'email' : 'google')
          : 'email';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.display_name = token.display_name as string;
        session.user.username = token.username as string;
        session.user.avatar_url = token.avatar_url as string | null;
        session.user.provider = token.provider as 'google' | 'email';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
