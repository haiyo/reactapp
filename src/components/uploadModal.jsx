import React, { Component } from "react";
import {Progress} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import config from "./../config.json";

class UploadModal extends Component {
    state = {
        selectedFile: null,
        loaded: 0
    }

    onChangeHandler = (event) => {
        var files = event.target.files;
        
        if(this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
            this.setState({
                selectedFile: files
            });
        }
    }

    onClickHandler = (event) => {
        // NOTE: Since this is a quick bake, we don't handle complex validation.
        const data = new FormData();

        if(this.textInput.value === "") {
             toast.error("Please enter a title for the video.");
             this.textInput.focus();
             return false;
        }
        
        data.append("title", this.textInput.value);

        if(this.state.selectedFile === null) {
            toast.error("Please select MP4 video for upload.");
            return false;
        }

        for(var x = 0; x<this.state.selectedFile.length; x++) {
            data.append("file", this.state.selectedFile[x]);
        }

        axios.post(config.Server_URL + "/upload", data, { 
            onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                });
            }
        })
        .then(res => {
            toast.success("Upload successful!");
            //console.log(res.statusText);
            
            setTimeout(function() {
                this.textInput.value = "";
                this.resetsFileInput();
                window.refresh();
            }
            .bind(this), 2000);
        });
    };

    maxSelectFile = (event) => {
        let files = event.target.files; // create file object

        if (files.length > config.File_upload.numFiles) { 
            const msg = "Only " + config.File_upload.numFiles + " file can be uploaded at a time";
            event.target.value = null; // discard selected file
            toast.warn(msg);
            return false;
        }
        return true;
    };

    checkMimeType = (event) => {
        //getting file object
        let files = event.target.files;

        //define message container
        let err = "";
        // list allow mime type
        const types = ["video/mp4"];
        
        // loop access array
        for(let x = 0; x<files.length; x++) {
            // compare file type find doesn"t matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err = "Unknown file type. Please upload only MP4 format.\n";
                break;
            }
        };

        if (err !== "") {
            event.target.value = null; // discard selected file
            toast.warn(err);
            //console.log(err);
            return false; 
        }
        return true;
    };

    checkFileSize = (event) => {
        let files = event.target.files;
        let size = config.File_upload.size; 
        let err = "";

        for(var x = 0; x<files.length; x++) {
            //console.log(files[x].size)
            if (files[x].size > size) {
                err += files[x].type + " is too large, please pick a smaller file\n";
            }
        };
        if (err !== "") {
            event.target.value = null;
            toast.warn(err);
            //console.log(err);
            return false;
        }

        return true;
    }

    resetsFileInput = (event) => {
        let randomString = Math.random().toString(36);

        this.setState({
            theInputKey: randomString
        });
    }

    render() {
        return (
            <div className="modal fade" id="uploadModal" role="dialog" 
            aria-labelledby="uploadModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="uploadModalLabel">Upload Video</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form method="post" action="#" id="#">
                                <div className="form-group mb-2">
                                    <input type="text" className="form-control" id="title" 
                                    ref={(input) => { this.textInput = input; }}
                                    placeholder="Enter a title for this video" />
                                </div>
                                <div className="form-group files">
                                    <input type="file" className="form-control" multiple 
                                    key={this.state.theInputKey || '' } 
                                    onChange={this.onChangeHandler} />
                                </div>
                            </form>
                            <div className="form-group mt-2">
                                <Progress max="100" color="success" 
                                value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success btn-block uploadBtn" 
                            onClick={this.onClickHandler}>Upload</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default UploadModal;