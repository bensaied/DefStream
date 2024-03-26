const winston = require('winston');
require('winston-mongodb');
const { createLogger, format, transports, config } = require('winston');
const { combine, timestamp, metadata, label, printf } = format;

//////////////////////////////////////////////////////////////////Format Personalisée
/*const myFormat = printf(({ level, timestamp, message }) => {
  return `${timestamp} ${level}: ${message} `;});*/


//////////////////////////////////////////////////////////////////////////////////////////////LOG ACCOUNT(Admin/ User)
////////////////////////////////////////////////LOG User's Account Creation 
const userLog = winston.createLogger({
  level: 'info',
  format: combine(
    //format.colorize(),
    //timestamp( {format: "HH:mm:ss" }),
    metadata(),
    format.json()
  ),
  transports: [
      //new transports.Console(),
      //new winston.transports.File(
      // { filename: 'combined.log',
      // level: 'info'
      // }),
      new winston.transports.MongoDB(
        { 
          db: 'mongodb://localhost:27017/DefStream' ,
          level: 'info',
          options: { useUnifiedTopology: true },
          format: combine(
            //format.colorize(),
            //timestamp( {format: "HH:mm:ss" }),
            metadata(),
            format.json()
          ) 
        }),
    ]
});


//////////////////////////////////////////////////////////////////////////////////////////////LOG PASSWORDS
////////////////////////////////////////////////LOG Password Creation 


const missionLog = winston.createLogger({
  level: 'info',
  format: combine(
    //format.colorize(),
    //timestamp( {format: "HH:mm:ss" }),
    metadata(),
    format.json(),
    format.prettyPrint()
  ),
  transports: [
      //new transports.Console(),
      //new winston.transports.File(
      // { filename: 'combined.log',
      // level: 'info'
      // }),
      new winston.transports.MongoDB(
        { 
          db: 'mongodb://localhost:27017/DefStream' ,
          level: 'info',
          json: false,
          prettyPrint: true,
          options: { useUnifiedTopology: true },
          format: combine(
            //format.colorize(),
            //timestamp( {format: "HH:mm:ss" }),
            metadata(),
            format.json()
          ) 
        }),
    ]
});

module.exports = userLog; 
/////
module.exports = missionLog; 
