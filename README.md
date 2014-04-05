#Clrlog#
##Lightweight colorful JavaScript application logger with stack trace and logfile support for node.js##

[![Dependency Status](https://gemnasium.com/BernhardBezdek/clrlog.svg)](https://gemnasium.com/BernhardBezdek/clrlog)

![Image](https://raw.githubusercontent.com/BernhardBezdek/Clrlog/master/previews/example_output.png "Example output")

#How to use#
Require the Clrlog class

    var Clrlog = require(__dirname + '/../index.js');

To give log messages color set global.DEBUG=true or run application in node.js's debug mode

    global.DEBUG = true;

Clrlog can be used as a function

    Clrlog("Hello I'm Clrlog");

Or as an object

    var myClrlog = new Clrlog("I also support logging into logfiles", 'success', __dirname + '/application.log');
        myClrlog.logLevel = 'error';
        myClrlog.error('This line is not written into logfile');


Set custom log levels for a single logmessage type

    myClrlog.logLevel = 'error';

Or set log levels for multiple log message types

    myClrlog.logLevel = 'error,warning,success';


The logs are stored in the following format

    Sat Apr 05 2014 20:32:42 GMT+0200 (CEST) | SUCCESS ᑀ And hold log instances for more complex logging purposes
    Sat Apr 05 2014 20:32:42 GMT+0200 (CEST) | SUCCESS ᑀ The current loglevel is message,success
    Sat Apr 05 2014 20:32:42 GMT+0200 (CEST) | MESSAGE ᑀ This message goes into the logfile
    Sat Apr 05 2014 20:32:42 GMT+0200 (CEST) | SUCCESS ᑀ This line goes into the logfile too
    Sat Apr 05 2014 20:32:42 GMT+0200 (CEST) | SUCCESS ᑀ {
    	"I": "can",
    	"log": "Objects too"
    }


#Full working example (demo/demo.js)#

    (function () {
        "use strict";

        // Enable global.DEBUG for colorful logging purposes in your shell
        // OR colorize logging when node is started in debug mode
        global.DEBUG = true;

        // Fetch Clrlog
        var Clrlog = require(__dirname + '/../index.js');

        ////////////////////////////////////////////////////////
        /////Call Clrlog like a plain old javascript funtion/////
        ////////////////////////////////////////////////////////

        Clrlog("Hello I'm Clrlog");
        Clrlog("I was successful", 'success');
        Clrlog("I've need to warn you ", 'warning');
        Clrlog("I've made a mistake", 'error');

        // Object Logging
        Clrlog({
            I: 'can',
            log: 'Objects too'
        }, 'success');


        // Save log messages in a file
        Clrlog("And I can store my logs into a file", 'message', __dirname + '/example.log');

        // Show stack trace behind logmessage
        Clrlog("My logs can also include a detailed stack trace", 'success', false, true);


        ////////////////////////////////////////////////////////
        /////Call Clrlog as an object for more comples stuff/////
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

    })();

Author:
Clrlog was written by Bernhard Bezdek

Released under MIT License

###Dependencies###
    node.js file system api