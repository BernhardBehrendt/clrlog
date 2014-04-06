(function () {
    "use strict";

    // Enable global.DEBUG for colorful logging purposes
    // OR colorize logging when node is started in debug mode
    // global.DEBUG = true;
    //
    // A file named debug was created in applications root folder
    // so global.DEBUG is automatically set to true

    // Fetch Clrlog
    var Clrlog = require(__dirname + '/../index.js');

    ////////////////////////////////////////////////////////
    /////Call Clrlog like a plain old javascript funtion////
    ////////////////////////////////////////////////////////

    Clrlog("Hello I'm clrlog");
    Clrlog("I was successful", 'success');
    Clrlog("I've need to warn you ", 'warning');
    Clrlog("I've made a mistake", 'error');

    // Object Logging
    Clrlog({
        I: 'can',
        log: 'Objects too'
    }, 'success');


    // Save log messages in a file
    var oFirsInstance = Clrlog("And I can store my logs into a file", 'message', __dirname + '/example.log');

    console.log("");
    console.log("");

    // Show stack trace behind logmessage
    Clrlog("My logs can also include a detailed stack trace", 'success', false, true);

    console.log("");
    console.log("");

    ////////////////////////////////////////////////////////
    /////Call Clrlog as an object for more comples stuff////
    ////////////////////////////////////////////////////////

    var myClrlog = new Clrlog("And hold log instances for more complex logging purposes", 'success', __dirname + '/application.log');

    // LogLevel can be set on custom purposes
    myClrlog.logLevel = 'error';         // Only errormessages
    myClrlog.logLevel = 'warning';       // Only warnings
    myClrlog.logLevel = 'success';       // Only success
    myClrlog.logLevel = 'message';       // Only messages


    // Combined log levels are possble too
    myClrlog.logLevel = 'error,warning';
    myClrlog.logLevel = 'error,warning,success';
    myClrlog.logLevel = 'message,success';


    // Loglevel settings example
    myClrlog.logLevel = 'message,success';

    myClrlog.success('The current loglevel is ' + myClrlog.logLevel);

    myClrlog.message('This message goes into the logfile');
    myClrlog.error('This line is not written into logfile');
    myClrlog.success('This line goes into the logfile too');

    myClrlog.success({
        I: 'can',
        log: 'Objects too'
    });


})();