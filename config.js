module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  URL: process.env.BASE_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://jimfire:kiipz42@ds123584.mlab.com:23584/films-base',
  JWT_SECRET: process.env.JWT_SECRET || 'secret1',
  ROLE_USER: 1,
  ROLE_ADMIN: 2,
  POSITION_STATUS_FREE: 0,
  POSITION_STATUS_RESERVED: 1,
  POSITION_STATUS_SOLD: 2,
  //0-free 1-reserved 2-sold
};
