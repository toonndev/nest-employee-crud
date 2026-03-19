import 'dotenv/config';

export const APP = {
  port: Number.parseInt(process.env.APP_PORT, 10) || 3000,
  title: process.env.APP_TITLE || 'Employee CRUD',
  description: process.env.APP_DESCRIPTION || 'Employee CRUD',
  version: process.env.APP_VERSION || '1.0.0',
  secretKeyJwt: process.env.JWT_SECRET || 'secret',
};
