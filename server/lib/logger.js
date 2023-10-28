const winston = require('winston');
const { format } = winston;
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss',
    }),
    format.splat(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return (
        `${level}: ${[timestamp]}: ` +
        (undefined !== message ? message : '') +
        (meta && Object.keys(meta).length ? '\n\t' + JSON.stringify(meta) : '')
      );
    })
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
