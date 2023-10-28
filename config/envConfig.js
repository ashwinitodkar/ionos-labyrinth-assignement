module.exports = {
    environmentName: process.env.NODE_ENV,
    appPort: process.env.APP_PORT,
    protocol: 'http://',
    domain: 'localhost',
    secret: 'ionos-secret',
    logs: {
      logFolder: './logs/', //`/logs/${os.hostname()}`
    },
    mongo: {
      uri: `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}`
    }
  };
  