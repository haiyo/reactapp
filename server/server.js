const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const { config } = require("process");
ffmpeg.setFfmpegPath(ffmpegPath);

var global = null;
var settings = null;

if(process.argv[3] == "serverTest") {
    global = require("./server.global.test");
}
else {
    global = require("./server.global");
}
settings = global.getConfig();

function getSettings() {
    return settings;
}

exports.getSettings = getSettings;

app.use(cors());
app.use(express.static(settings.imageStorageDir));
app.use(express.static(settings.videoStorageDir));

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, settings.videoStorageDir);
    },
    filename: function (req, file, cb) {
        // Always have a unique filename on saved.
        cb(null, Date.now() + "-" + file.originalname);
    }
});

if (!fs.existsSync(settings.fileDB)) {
    // try creating one.
    fs.writeFile(settings.fileDB, "", function(err) {
        if(err) {
            console.log(err);
        }
        console.log("The file was saved!");
    });
}

const upload = multer({ storage: storage }).array("file");

app.post("/upload",function(req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        }
        else if (err) {
            return res.status(500).json(err);
        }
        else {
            // We will use Ffmpeg to generate screenshot
            takeScreenshots(req.files[0].filename, settings.videoStorageDir, settings.imageStorageDir);

            writeDB(req.body.title, req.files[0].filename);
        }
        return res.status(200).send(req.files[0].filename);
    });
});

// NOTE: For test project, we just plain read with no security like token set.
app.get("/readDB",function(req, res) {
    try {
        const data = readDB();
        return res.status(200).send(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

function readDB() {
    return fs.readFileSync(settings.fileDB, "utf8");
}

exports.readDB = readDB;

function takeScreenshots(filename) {
    console.log("Generating image from video", settings.videoStorageDir + filename + " Store dir: " + settings.imageStorageDir);

    ffmpeg({source: settings.videoStorageDir + filename})
    .on("filenames", (filenames) => {
        console.log("Created file names", filenames);
    })
    .on("end", () => {
        settings.screenshotTaken = true;
        console.log("job done");
    })
    .on("error", (err) => {
        console.log("Error", err);
        return res.status(500).json(err);
    })
    .takeScreenshots({
        filename: filename + ".jpg",
        // Take one screenshot. For multiple just add more time marks in array;
        timemarks: [4]
    }, settings.imageStorageDir);
}

exports.takeScreenshots = takeScreenshots;

function writeDB(title, filename) {
    if(settings.screenshotTaken === false) {
        /* this checks the flag every 100 milliseconds*/
        setTimeout(function() {
            writeDB(title, filename);
        }, 100);
    }
    else {
        var data = "";
        var records = fs.readFileSync(settings.fileDB);
        
        // Clear initial startup empty brace.
        if(records.toString() === "") {
            var obj = new Array();
            obj.push({
                id: 1, 
                title: title, 
                image: filename + ".jpg", 
                filename: filename, 
                datetime: Date.now()
            });
        }
        else {
            var obj = JSON.parse(records.toString());
            obj.push({
                id: obj.length+1, 
                title: title, 
                image: filename + ".jpg", 
                filename: filename, 
                datetime: Date.now()
            });
        }

        data = JSON.stringify(obj);

        // Write to file as our DB
        fs.writeFileSync(settings.fileDB, data, "utf8",
            // callback function
            function(err) {     
                if (err) throw err;
                // if no error
                console.log("Data is appended to file successfully.")
        });
        return true;
    }
}

exports.writeDB = writeDB;

function testing() {
    return settings.screenshotTaken;
}

exports.testing = testing;


const appResult = app.listen(8000, function() {
    console.log("App running on port 8000");
});

exports.appResult = appResult;