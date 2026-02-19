-- Set admin role using public.users table directly
-- Update by email patterns commonly used for admin accounts
UPDATE users SET role = 'admin' WHERE id IN (
  SELECT u.id FROM users u
  JOIN auth.users au ON au.id = u.id
  WHERE au.email = 'admin@circlepicks.com'
);
