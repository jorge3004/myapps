const cors = ((req, res, next) => {

    // Website you wish to allow to connect
    res.setheader('Access-Control-Allow-Origin', 'https://dev.jir3d.com');

    // Request methods you wish to allow
    res.setheader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setheader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setheader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
module.exports = { cors }