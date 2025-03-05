const express = require('express');
const morgan = require('morgan');
require('dotenv').config({ path: './config.env' });
const route = require('./route/route');
const err = require('./utils/errorHandle');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT;
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: 'Too many request.'
})
app.use('/api/v1', limiter);
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(express.json({ limit: '200kb' }));
app.use(morgan('dev'));

app.use('/api/v1', route);
app.all('*', (req, res, next) => {
    err.mapError(404, 'Path not found', next);
});
app.use(err.apiError)

app.listen(port, () => {
    console.log("server is running port", port);
});