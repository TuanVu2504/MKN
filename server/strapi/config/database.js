module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'dbadmin'),
      password: env('DATABASE_PASSWORD', 'P@$$w0rd1003Opennet'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
