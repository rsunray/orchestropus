//module imports
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
//socket namespace handlers imports
const home = require('./sockets/homeSocket');
const redisChangeListener = require('./sockets/redisChangeListener');
//pipeline routes imports
const initiateJob = require('./routes/jobRoutes/initiateJob');
const getJobList = require('./routes/jobRoutes/getJobList');
const authentication = require('./routes/authentication.js');
const userJobList = require('./routes/userActivityRoutes/userJobList');
const slacknotify = require('./routes/slacknotify.js');
//workflow routes imports
const updateWorkflow = require('./routes/workflowRoutes/updateWorkflow');
const getAllWorkflows = require('./routes/workflowRoutes/getAllWorkflows');
const deleteWorkflow = require('./routes/workflowRoutes/deleteWorkflow');
const addWorkflow = require('./routes/workflowRoutes/addWorkflow');
const getOneWorkflow = require('./routes/workflowRoutes/getOneWorkflow');
//hook routes
const triggers = require('./routes/triggerRoutes/triggers');
//report routes
const getReports = require('./routes/reportRoutes/getReports');
const downloadReport = require('./routes/reportRoutes/downloadReport');

//parser imports
const bodyParser = require('body-parser');

//request parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//response headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//static file service
app.use(express.static('../Client/'));

//routes list
app.use('/',function(req,res,next){
	console.log("Into the routes...");
	next();
},authentication,triggers,initiateJob,getReports,downloadReport,getJobList,updateWorkflow,getAllWorkflows,deleteWorkflow,getOneWorkflow,addWorkflow,userJobList,slacknotify);

//socket listeners
io.on('connection',home);
io.of('/monitor').on('connection',redisChangeListener);

//server setup
server.listen(3000,console.log("Server is listening on port 3000..."));

//server export
module.exports = server;
