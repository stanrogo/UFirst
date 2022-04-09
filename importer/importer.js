const fs = require('fs');
const readline = require('readline');

class Importer {
  constructor() {
    const pattern = Object.values(Importer.patterns).join(' ');
    this.regExp = new RegExp(pattern);
    this.json = null;
  }

  static outputFilePath = './output.json';
  static inputFilePath = './epa-http.txt';

  static patterns = {
    'host': '((?:[a-zA-Z0-9\\-]+\\.)+[a-zA-Z0-9]+)',
    'dateTime': '\\[(\\d{2}):(\\d{2}):(\\d{2}):(\\d{2})\\]',
    'request': '"([A-Z]+)?(.*)(?: ([A-Z]+)\\/([0-9.]+))?"',
    'httpCode': '([0-9]+)',
    'bytes': '([0-9]+|-)',
  };

  /**
   * Import the EPA file into JSON, writing to disk and memory if it not exists
   * @returns {Promise} A promise which resolves with the JSON of the EPA file
   */
  import() {
    return new Promise((resolve, reject) => {
      if (this.json != null) resolve(this.json);

      fs.readFile(Importer.outputFilePath, async (err, data) => {
        if (err) {
          try {
            const inputData = await this.parse();
            data = await this.writeOutput(inputData);
          } catch (err) {
            reject(err.message);
          }
        }

        this.json = data;
        resolve(this.json);
      });
    });
  }

  /**
   * Parse the input file into an array
   * @returns {Promise} A promise which resolves when input has been parsed 
   */
  parse() {
    return new Promise((resolve, reject) => {
      const ret = [];

      try {
        const rl = readline.createInterface({
          input: fs.createReadStream(Importer.inputFilePath),
        });

        rl.on('line', (line) => {
          try {
            this.parseLine(ret, line)
          } catch (err) {
            reject(err);
          }
        });
        rl.on('close', () => resolve(ret));
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Parse a single request line into its constituent components
   * @param {Array} outputArray The array to append the processed line to
   * @param {String} line The line to process
   * @throws {Error} Thrown when line does not conform to the regular expression
   */
  parseLine(outputArray, line) {
    const matches = line.match(this.regExp);
    if (matches == null) {
      throw new Error(`Line parse failed for line ${line}`);
    }

    const [, host, day, hour, minute, second, method, url, protocol,
      protocol_version, response_code, document_size] = line.match(this.regExp);
    var entry = {
      host,
      'datetime': { day, hour, minute, second },
      'request': {
        method,
        'url': encodeURIComponent(url),
        protocol,
        protocol_version
      },
      response_code,
      document_size
    };
    outputArray.push(entry);
  }

  /**
   * Write the given array to a JSON file on disk
   * @param {Array} outputArray The array to store on disk
   * @returns {Promise} A promise which resolves when writing is complete
   */
  writeOutput(outputArray) {
    return new Promise((resolve, reject) => {
      const json = JSON.stringify(outputArray);

      fs.writeFile(Importer.outputFilePath, json, (err) => {
        if (err) {
          reject(err);
        }
        resolve(json);
      });
    });
  }
}

module.exports = Importer;
