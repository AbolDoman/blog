const winston=require('winston');
const root=require('app-root-path');
const logger=new winston.createLogger({
    transports:[
        new winston.transports.File({
            level: "info",
            filename:`${root}/logs/app.log`,
            handleExceptions:true,
            format: winston.format.json(),
            maxsize:5000000,
            maxFiles:10,
        }),
        new winston.transports.Console({
            level: "debug",
            handleExceptions:true,
            exitOnerror:false,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()),
        })
    ]
})
logger.stream = {
    write: function(message){
        logger.info(message);
    }
}
module.exports={
    logger
}