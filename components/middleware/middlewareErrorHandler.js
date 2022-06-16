const logger = require('../utils/Logger');
const logError = (err,req,res,next) => { 

    //write in file di log Error
    logger.logInfo("Fine processamento richiesta\n");
    logger.logError(err.stack+"\n");

    next(err);
}

const errorHandler = (err,req,res,next) => { 
    res.status(500).send({"error": err.message});
}

module.exports = {
    logError: logError,
    errorHandler: errorHandler,
};