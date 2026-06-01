const asyncHandler = (handlerController) =>{
    // Forward rejected promises to Express error middleware.
    return (req,res,next) =>
        Promise.resolve(handlerController(req,res,next)).catch(next)
}

export default asyncHandler
