const fs = require('fs');
const { execSync } = require('child_process');

module.exports = {
    /**
     * simplistic CSV reader
     * @param {} pagesCSVFname
     */
    readCSVFile: function (pagesCSVFname) {
        var lines = this.readListFile(pagesCSVFname);
        var header = [];
        var rows = [];
        for (const i in lines) {
            var line = lines[i];
            var cols = line.split(',');
            if (i == 0) {
                header = cols;
                continue;
            }
            var row = [];
            for (const i in header) {
                row[header[i]] = cols[i];
            }
            rows.push(row);
        }
        return rows;
    },

    // reads a file removing all comments (#) and blank lines
    // and converts each line to a regexp
    readRegExpFile: function (fname) {
        var lines = this.readListFile(fname);
        var rows = [];
        for (const i in lines) {
            var line = lines[i];
            var regexp = new RegExp(line, 'i');
            console.log(regexp);
            rows.push(regexp);
        }
        return rows;
    },

    /**
     *  reads a file removing all comments (#) and blank lines
     */
    readListFile: function (fname) {
        var lines = this.readTextFile(fname);
        var rows = [];
        for (const i in lines) {
            var line = lines[i];
            if (line.substring(0, 1) === '#') continue;
            if (line.length === 0) continue;
            rows.push(line);
        }
        return rows;
    },

    /**
     * read a text file as an array of strings
     */
    readTextFile: function (fname) {
        var text = this.readFile(fname);
        var textByLine = text.split('\n');
        return textByLine;
    },

    /**
     * read a text file as one long string
     */
    readFile: function (fname) {
        var text = "";
        try {
            text = fs.readFileSync(fname).toString('utf-8');
        } catch(ex) {
            // do nothing
        }
        return text;
    },

    /**
     * write an array of strings to a text file
     */
    writeTextFile: function (fname, list) {
        var buffer = new Buffer.from(list.join('\n'));

        var fd = fs.openSync(fname, 'w');
        fs.writeSync(fd, buffer, 0, buffer.length, null);
        fs.close(fd);
    },
    writeFile: function (fname, str) {
        let lastSlash = fname.lastIndexOf('/');
        if (lastSlash > -1) {
            dirname = fname.substring(0, lastSlash);
            this.createDir(dirname);
        }
        var buffer = new Buffer.from(str);
        var fd = fs.openSync(fname, 'w');
        fs.writeSync(fd, buffer, 0, buffer.length, null);
        fs.closeSync(fd);
    },
    createFile: function (fname) {
        console.log(`fname=${fname}`);
        this.writeFile(fname, '');
    },
    createDir: function (dirname) {
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true }, err => {
                if (err) throw err;
            });
        }
    },

    readDir: function (dirname) {
        return fs.readdirSync(dirname);
    },
    /**
     * run the command and return the stdout
     * if there's an error, returns stderr
     */
    run: function (cmd) {
        return execSync(cmd, (err, stdout, stderr) => {
            if (err) {
                return stderr;
            }
            return stdout;
        });
    }
};
