import client from './client';

/**
 * POST /auth/signup
 * Body: { name: string, email: string, password: string }
 * Returns: { message, user: { id, name, email } }
 */
export const signup = async ({ name, email, password }) => {
  const response = await client.post('/auth/signup', { name, email, password });
  return response.data;
};

/**
 * POST /auth/login
 * Body: { email: string, password: string }
 * Returns: { message, access_token, token_type, user: { id, name, email } }
 */
export const login = async ({ email, password }) => {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
};

/**
 * GET /auth/me
 * Requires Bearer token
 * Returns: { id, name, email }
 */
export const getMe = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};

/**
 * PUT /auth/me
 * Body: { name: string }
 * Returns: { message, user: { id, name, email } }
 */
export const updateProfile = async ({ name }) => {
  const response = await client.put('/auth/me', { name });
  return response.data.user || response.data;
};

