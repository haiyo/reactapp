import { shallow, configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import UploadModal from "../uploadModal";
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect";
import config from "./../../config.json";

configure({ adapter: new Adapter() });

const event = new Array();
event["target"] = new Array();
event["target"]["value"] = "";

const files = new Array();
files[0] = new Array();

it("renders without crashing", () => {
    render(<UploadModal />);

    const element = screen.getByTestId("uploadModal");
    expect(element).toBeInTheDocument();
});

it("validate file on wrong mimetype should return false", () => {
    files[0]["type"] = "application/pdf";

    const uploadComponent = shallow(<UploadModal />);
    expect(uploadComponent.instance().checkMimeType(event, files)).toBe(false);
});

it("validate file on correct mimetype should return true", () => {
    files[0]["type"] = "video/mp4";

    const uploadComponent = shallow(<UploadModal />);
    expect(uploadComponent.instance().checkMimeType(event, files)).toBe(true);
});

it("validate file on file size too big should return false", () => {
    files[0]["size"] = parseInt(config.File_upload.sizeLimit) + 1;
    
    const uploadComponent = shallow(<UploadModal />);
    expect(uploadComponent.instance().checkFileSize(event, files)).toBe(false);
});

it("validate file on file size if within the config size limit should return true", () => {
    files[0]["size"] = parseInt(config.File_upload.sizeLimit) - 1;
    
    const uploadComponent = shallow(<UploadModal />);
    expect(uploadComponent.instance().checkFileSize(event, files)).toBe(true);
});

it("validate file on more than number of files limit should return false", () => {
    // Based on config, we add one more file artificially so as we passed the limit.
    let numFiles = parseInt(config.File_upload.numFiles) + 1;

    for(var i=1; i<numFiles; i++) {
        files[i] = new Array();
    }
    
    const uploadComponent = shallow(<UploadModal />);
    expect(uploadComponent.instance().maxSelectFile(event, files)).toBe(false);
});