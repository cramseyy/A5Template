var express = require('express');
var path = require('path');

var applicationRouter = require('./routes/application');
var publicRouter = require('./routes/public');

var app = express();
app.use(express.urlencoded({ extended: true }));

app.use('/application/', applicationRouter);
app.use('/', publicRouter);





const PORT = 3050
app.listen(PORT, () => console.info(`Server is running on ${PORT}`))


module.exports = app;