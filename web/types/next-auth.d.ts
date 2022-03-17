import { Session } from 'next-auth';

import type { Language } from '@features/language';

declare module 'next-auth' {
  interface Session { 
    userId?: string,
    user: {
      languages: Language[],
      image?: string,
    }
  }
}
