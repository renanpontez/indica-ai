-- Set admin role for admin@circlepicks.com
UPDATE users SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@circlepicks.com');
