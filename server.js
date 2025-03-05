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

app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', route);
app.all('*', (req, res, next) => {
    err.mapError(404, 'Path not found', next);
});
app.use(err.apiError)

app.listen(port, () => {
    console.log("server is running port", port);
});