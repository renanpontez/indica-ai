-- Set admin role for app@circlepicks.app
UPDATE users SET role = 'admin' WHERE id IN (
  SELECT u.id FROM users u
  JOIN auth.users au ON au.id = u.id
  WHERE au.email = 'app@circlepicks.app'
);
