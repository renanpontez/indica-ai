import { getServerUser } from './getServerUser';

export async function getAdminUser() {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}
