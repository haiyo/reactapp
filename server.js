const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

app.use(cors());

// NOTE: Not using public folder for storage due to react monitoring the folder. 
// If any files changes in the public folder, react will refresh the portal.
var videoStorageDir = "./storage/videos/";
var imageStorageDir = "./storage/images/";
var fileDB = "./src/db.json";
var screenshotTaken = false;
var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, videoStorageDir);
    },
    filename: function (req, file, cb) {
        // Always have a unique filename on saved.
        cb(null, Date.now() + "-" + file.originalname);
    }
});

if (!fs.existsSync(fileDB)) {
    // try creating one.
    fs.writeFile(fileDB, "{}", function(err) {
        if(err) {
            console.log(err);
        }
        console.log("The file was saved!");
    });
}

var upload = multer({ storage: storage }).array("file");

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
            takeScreenshots(req.files[0].filename, videoStorageDir, imageStorageDir);

            writeDB(req.body.title, req.files[0].filename);
        }
        return res.status(200).send(req.file);
    });
});

function takeScreenshots(filename) {
    console.log("Generating image from video", videoStorageDir + filename + " Store dir: " + imageStorageDir);

    ffmpeg({source: videoStorageDir + filename})
    .on("filenames", (filenames) => {
        console.log("Created file names", filenames);
    })
    .on("end", () => {
        screenshotTaken = true;
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
    }, imageStorageDir);
}

function writeDB(title, filename) {
    if(screenshotTaken === false) {
        /* this checks the flag every 100 milliseconds*/
        setTimeout(function() {
            writeDB(title, filename);
        }, 100);
    }
    else {
        var data = "";
        var records = fs.readFileSync(fileDB);
        
        // Clear initial startup empty brace.
        if(records.toString() === "{}") {
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
        fs.writeFileSync(fileDB, data, "utf8",
            // callback function
            function(err) {     
                if (err) throw err;
                // if no error
                console.log("Data is appended to file successfully.")
        });
    }
}

app.listen(8000, function() {
    console.log("App running on port 8000");
});