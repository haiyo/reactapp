// NOTE: Not using public folder for storage due to react monitoring the folder. 
// If any files changes in the public folder, react will refresh the portal.
module.exports = {
    getConfig: function () {
        var config = new Array();
        config["testMode"] = true;
        config["videoStorageDir"] = "./public/storage/videoTest/";
        config["imageStorageDir"] = "./public/storage/imageTest/";
        config["fileDB"] = "../db.test.json";
        config["screenshotTaken"] = true;
        return config;
    }
};