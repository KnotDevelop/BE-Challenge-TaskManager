exports.mapError = (code, message, next) => {
    const err = new Error();
    err.statusCode = code;
    err.status = message;
    next(err);
}
exports.apiError = (err, req, res, next) => {
    res.status(err.statusCode).json({ message: err.status });
}
