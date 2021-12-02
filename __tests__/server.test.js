const server = require("./../server");
const fs = require("fs");
const request = require("supertest");

const settings = server.getSettings();

test("Make sure we are in testing mode", () => {
    expect(settings.testMode).toBe(true);
});

test("Check if db.test.json is created as our test DB", () => {
    expect(fs.existsSync("./db.test.json")).toBe(true);
});

test("Write data to our test DB file", () => {
    expect(server.writeDB("TestTitle", "TestFile")).toBe(true);
});

test("Read data from our test DB file", () => {
    const data = JSON.parse(server.readDB());

    expect(data[0].id).toEqual(1);
    expect(data[0].title).toEqual("TestTitle");
    expect(data[0].image).toEqual("TestFile.jpg");
    expect(data[0].filename).toEqual("TestFile");
});

const videoFile = settings.videoStorageDir + "/sample-mp4-file.mp4";
var filename = null;

test("Make sure our sample video file exist", () => {
    expect(fs.existsSync(videoFile)).toBe(true);
});

test("Upload a new video file using our sample video file", () => {
    return request(server.appResult)
            .post('/upload')
            .attach('file', videoFile)
            .then((res) => {
                console.log(settings.imageStorageDir + res.text + ".jpg")
                expect(res.status).toEqual(200);

                filename = res.text;
                expect(fs.existsSync(settings.videoStorageDir + filename)).toBe(true);
            })
            .catch(err => console.log(err));
});

test("Check if screenshot exist after video uploaded", async () => {
    // Wait for a moment while screenshot generate.
    await wait(500);
    expect(fs.existsSync(settings.imageStorageDir + filename + ".jpg")).toBe(true);
});

test("Remove test data DB", () => {
    fs.unlinkSync("./db.test.json");
    expect(fs.existsSync("./db.test.json")).toBe(false);
});

test("Remove generated screenshot", () => {
    fs.unlinkSync(settings.imageStorageDir + filename + ".jpg");
    expect(fs.existsSync(settings.imageStorageDir + filename + ".jpg")).toBe(false);
});

test("Remove uploaded file", () => {
    fs.unlinkSync(settings.videoStorageDir + filename);
    expect(fs.existsSync(settings.videoStorageDir + filename)).toBe(false);
});

function wait(milleseconds) {
    return new Promise(resolve => setTimeout(resolve, milleseconds));
}
