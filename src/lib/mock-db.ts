import { Location, mockLocations } from '@/constants/mock-data';

// Keep data alive across Next.js Hot Module Replacements in development
const globalForDb = globalThis as unknown as { mockDb: Location[] };

export const mockDb = globalForDb.mockDb || [...mockLocations];

if (process.env.NODE_ENV !== 'production') {
  globalForDb.mockDb = mockDb;
}
