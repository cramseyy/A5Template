var express = require('express');
var path = require('path');

var applicationRouter = require('./routes/application');
var cartRouter = require('./routes/cart');
var publicRouter = require('./routes/public');

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use('/application/', applicationRouter);
app.use('/application/cart', cartRouter);
app.use('/', publicRouter);





const PORT = 3050
app.listen(PORT, () => console.info(`Server is running on ${PORT}`))


module.exports = app;