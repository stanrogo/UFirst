// Write a script that imports the access log file and creates a newfile that holds the log
// data structured as a JSON-Array. (See the example at the bottom of this page)

var fs = require('fs');
var readline = require('readline');

var jsonFilePath = './output.json';
var hostPattern = '((?:[a-zA-Z0-9\\-]+\\.)+[a-zA-Z0-9]+)'; // TODO: matches other parts of string
var dateTimePattern = '\\[(\\d{2}):(\\d{2}):(\\d{2}):(\\d{2})\\]'; 
var requestPattern = '"([A-Z]+) (\\/(?:.)*) ([A-Z]+)\\/([0-9.]+)"'; 
var httpReplyCodePattern = '([0-9]+)'; 
var bytesInReplyPattern = '([0-9]+|-)'; 
var pattern = [hostPattern, dateTimePattern, requestPattern, httpReplyCodePattern, bytesInReplyPattern].join(' ');
var regExp = new RegExp(pattern);

function genJson() {
    return new Promise((resolve, reject) => {
        try {
            var rl = readline.createInterface({
                input: fs.createReadStream('./epa-http.txt'),
            });

            var ret = [];
        
            rl.on('line', (line) => {
                var matches = line.match(regExp);
                if (matches == null) {
                    console.log(line);
                    return;
                }
        
                var [, host, day, hour, minute, second, method, url, protocol, protocol_version, response_code, document_size] = line.match(regExp);
                var entry = { host, 'datetime' : {day, hour, minute, second}, 'request' : {method, 'url' : encodeURIComponent(url), protocol, protocol_version}, response_code, document_size};
                ret.push(entry);
            });

            rl.on('close', function() {
                var json = JSON.stringify(ret);

                fs.writeFile(jsonFilePath, json, function(err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(ret);
                  });
            });
        } catch (err) {
            reject(err);
        }
    }); 
}

function getJson() {
    return new Promise(function(resolve, reject) {
        fs.readFile(jsonFilePath, function(err, data) {
            if (err) {
                genJson().then(x => resolve(x)).catch(err => reject(err));
                return;
            }

            resolve(JSON.parse(data));
        });
    });
}

module.exports = getJson;
