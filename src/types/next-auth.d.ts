import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      display_name: string;
      username: string;
      avatar_url: string | null;
      provider: 'google' | 'email';
    };
  }

  interface User {
    id: string;
    email: string;
    display_name?: string;
    username?: string;
    avatar_url?: string | null;
    provider?: 'google' | 'email';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
    provider: 'google' | 'email';
  }
}
