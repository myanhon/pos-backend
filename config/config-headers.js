module.exports = {
   setHeaders: function (req,res,next) {
       let allowedOrigins = ["http://localhost:8080", "http://localhost:1080", process.env.POS_FRONTEND_URL];
       let origin = req.headers.origin;
       if (allowedOrigins.includes(origin)) {
           res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
       }

       // // // Website you wish to allow to connect
       // res.setHeader('Access-Control-Allow-Origin', '*');

       // Request methods you wish to allow
       res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTION');

       // Request headers you wish to allow
       res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

       // Set to true if you need the website to include cookies in the requests sent
       // to the API (e.g. in case you use sessions)
       res.setHeader('Access-Control-Allow-Credentials', true);

       // Pass to next layer of middleware
       next();
    }
};