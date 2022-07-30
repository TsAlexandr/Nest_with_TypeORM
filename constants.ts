export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secret',
};
export const basicConstants = {
  login: process.env.LOGIN || 'admin',
  password: process.env.PASSWORD || '123',
};
