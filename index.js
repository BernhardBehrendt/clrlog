/*global DEBUG*/
/*global v8debug*/
/*global console*/
/*global process*/
var Clrlog = null;
(function () {
    "use strict";

    /**
     * Lightweight colorful JavaScript application logger with stack trace and logfile support for node.js
     * It detect by itself if node.js application is in debug mode.
     * Debug mode can be also enabled by set global.DEBUG===true
     * There's also logfile support to save logmessages including logging time
     *
     * Clrlog works called as a plain old javascript function and as an object for more comples purposes
     *
     * @author Bernhard Bezdek <bernhard.bezdek@googlemail.com>
     * @see https://github.com/BernhardBezdek/Clrlog/blob/master/README.md>
     * @license MIT https://github.com/BernhardBezdek/Clrlog/blob/master/LICENSE
     * @class Clrlog
     * @constructor
     * @param {Object} mLogdata The logging data (Any datatype allowed
     * @param {String} sType default 'message' (message, success, warning, error available)
     * @param {Boolean} sLogFile write messages into a log file (default none)
     * @param {Boolean} bTraceErrors Determine if errormessages should output as a trace shutdown application (default false)
     * @param {String} sProcessEnv Determine a process variable which enables the specific logging (Useful when several parts should have separate logging)
     * @return {Object} A Clrlog object (if called as a function
     */
    Clrlog = function (mLogdata, sType, sLogFile, sProcessEnv, bTraceErrors) {


        // Check if Clrlog was called as a function
        if (this !== undefined) {
            var fs = require('fs');

            if (process.env.DEBUG === undefined) {
                process.env.DEBUG = false;
            }

            // The end string for colored messages
            var logMethod = 'log';
            var logArchive = {};

            // Determine the output type
            if (this.types[sType] !== undefined) {
                this.type = sType;
            }

            // Enable Tracing for Errors
            if (typeof bTraceErrors === 'boolean' || typeof sProcessEnv === 'boolean') {
                this.trace = bTraceErrors;
            }

            if (this.explicityDebug === undefined) {
                this.explicityDebug = false;
            }

            if (process !== undefined && typeof process.env === 'object' && typeof sProcessEnv === 'string' && process.env[sProcessEnv] !== undefined) {
                this.explicityDebug = true;
                this.namespace = sProcessEnv.replace('LOG_', '') + '::'
            } else if (sProcessEnv !== undefined) {
                this.namespace = sProcessEnv.replace('LOG_', '') + '::';
            }


            // Override log method
            if (this.trace) {
                logMethod = 'trace';
            }

            if (sLogFile !== undefined) {
                this.logFile = sLogFile;
            }


            // Hanlde writing into a logfile
            if (this.logFile !== false && this.logLevel.split(',').indexOf(this.type) !== -1) {

                var sWriteFile = this.namespace + new Date().toString() + ' | ' + sType.toUpperCase() + ' ᑀ ';

                try {
                    if (['boolean', 'number', 'string'].indexOf(typeof (mLogdata)) !== -1) {
                        sWriteFile += mLogdata.replace(/"/g, '');
                    } else {
                        sWriteFile += JSON.stringify(mLogdata, null, "\t");
                    }

                    sWriteFile += "\n";

                    fs.appendFile(sLogFile, sWriteFile, function (error) {
                        if (error !== null) {
                            Clrlog(error);
                        }

                        if (logArchive[sLogFile] === undefined) {
                            logArchive[sLogFile] = setTimeout(function () {
                                fs.stat(sLogFile, function (error, stats) {
                                    if (error === null) {
                                        if (stats.size > 10000000) {

                                            fs.rename(sLogFile, sLogFile.replace(/.(\w)*$/, function (match) {
                                                return "." + Math.round(new Date().getTime() / 1000) + match;
                                            }), function (error) {

                                                if (error !== null) {
                                                    console.log(error);
                                                }

                                                delete logArchive[sLogFile];
                                            });
                                        } else {
                                            delete logArchive[sLogFile];
                                        }
                                    } else {
                                        delete logArchive[sLogFile];
                                    }
                                });
                            }, 10000);
                        }
                    });
                } catch (e) {
                    Clrlog(e, 'error');
                }
            }

            // In debug mode colorized messages are dumped out
            if (this.explicityDebug === true || process.env.DEBUG === true || process.env.DEBUG === 'true') {
                if (['boolean', 'number', 'string'].indexOf(typeof (mLogdata)) !== -1) {
                    console[logMethod](this.types[this.type] + this.namespace + mLogdata + this.endLog);
                } else {
                    console[logMethod](this.types[this.type]);
                    console[logMethod](this.namespace);
                    console[logMethod](mLogdata);
                    console[logMethod](this.endLog);
                }
            } else if (this.logLevel.indexOf(sType) !== -1) {

                if (['boolean', 'number', 'string'].indexOf(typeof (mLogdata)) !== -1) {
                    console[logMethod](this.namespace + mLogdata);
                } else {
                    console[logMethod](this.namespace);
                    console[logMethod](mLogdata);
                }
            }
        } else {
            // If it was a function call run as a class instance
            return new Clrlog(mLogdata, sType, sLogFile, sProcessEnv, bTraceErrors);
        }
    };

    /**
     * Determine if trace is used for errors
     * @property trace (default false)
     * @type {Boolean}
     */
    Clrlog.prototype.trace = false;

    /**
     * Determine specific debugin is enabled
     * @property debug (default false)
     * @type {Boolean}
     */
    Clrlog.prototype.debug = false;

    /**
     * The default message type
     * @property type (default message)
     * @type {String}
     */
    Clrlog.prototype.type = 'message';

    /**
     * Available log types
     * @property types
     * @type {Object}
     */
    Clrlog.prototype.types = {
        message: '\x1B[34m',        // Cyan colored
        success: '\x1B[32m',        // Green colored
        warning: '\x1B[33m',        // Yellow colored
        error: '\x1B[31m'           // Red colored
    };

    /**
     * The finalizing string for noncolored log Messages
     * @type {string}
     */
    Clrlog.prototype.endLog = '\x1B[39m';

    /**
     * @property logFile
     * @type {undefined}
     */
    Clrlog.prototype.logFile = false;

    /**
     * Specify which types log messages are written into a file
     * @property logLevel
     * @type {String}
     */
    Clrlog.prototype.logLevel = 'error,warning';

    /**
     * Throw error message with previously defined settings
     *
     * @method error
     * @param message
     */
    Clrlog.prototype.error = function (message) {
        this.constructor(message, 'error', this.logFile);
    };

    /**
     * Throw warning with previously defined settings
     *
     * @method warning
     * @param message
     */
    Clrlog.prototype.warning = function (message) {
        this.constructor(message, 'warning', this.logFile);
    };

    /**
     * Throw success message with previously defined settings
     *
     * @method success
     * @param message
     */
    Clrlog.prototype.success = function (message) {
        this.constructor(message, 'success', this.logFile);
    };

    /**
     * Throw message with previously defined settings
     *
     * @method message
     * @param message
     */
    Clrlog.prototype.message = function (message) {
        this.constructor(message, 'message', this.logFile);
    };
})();

module.exports = Clrlog;
