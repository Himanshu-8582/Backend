
// Note:- This function must return a callback function which takes req,res,next as parameters
export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    }
}


// We can Also write it as
 
// export const asyncHandler = (requestHandler) => async(req,res,next) => {
//     try {
//         await requestHandler(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }