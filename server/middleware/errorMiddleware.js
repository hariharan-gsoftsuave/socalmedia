//Usupported end point
const notFount =(req,res,next)=>{
    const error = new Error(`Not Found -${req.originalURL}` )
    res.status(404)
    next(error);
};

//Error Middleware
const errorHandler =(error,req, res, next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code||500).json({message:error.message||"An unknow error occured."});
}

module.exports = {notFount,errorHandler}