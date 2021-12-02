// NOTE: Not using public folder for storage due to react monitoring the folder. 
// If any files changes in the public folder, react will refresh the portal.
module.exports = {
    getConfig: function () {
        var config = new Array();
        config["testMode"] = false;
        config["videoStorageDir"] = "./public/storage/videos/";
        config["imageStorageDir"] = "./public/storage/images/";
        config["fileDB"] = "../db.json";
        config["screenshotTaken"] = false;
        return config;
    }
};