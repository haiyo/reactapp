import React, { Component } from "react";
import {Progress} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import config from "./../config.json";

class UploadModal extends Component {
    state = {
        title: "",
        selectedFile: null,
        loaded: 0,
        data: null
    }

    changeTitleHandler = (event) => {
        this.setState({title: event.target.value});
    }

    onChangeHandler = (event) => {
        var files = event.target.files;
        
        if(this.maxSelectFile(event, files) && this.checkMimeType(event, files) && this.checkFileSize(event, files)) {
            this.setState({
                selectedFile: files
            });
        }
    }

    onClickHandler = async () => {
        await this.validate();

        if(this.state.data !== null) {
            axios.post(config.Server_URL + "/upload", this.state.data, { 
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
                this.setState({
                    data: null,
                    title: "",
                    selectedFile: null,
                    loaded: 0
                });
                this.resetsFileInput();
                const { onUploaded } = this.props
                onUploaded();
                window.closeModal();
            }
            .bind(this), 2000);
            return true;
        });
        }
    };

    validate = () => {
        // NOTE: Since this is a quick bake, we don't handle complex validation.
        const data = new FormData();

        if(this.state.title === "") {
            toast.error("Please enter a title for the video.");
            return false;
        }
        
        data.append("title", this.state.title);

        if(this.state.selectedFile === null) {
            toast.error("Please select MP4 video for upload.");
            return false;
        }

        for(var x = 0; x<this.state.selectedFile.length; x++) {
            data.append("file", this.state.selectedFile[x]);
        }
        this.setState({data: data}, function () { });
        return true;
    };

    maxSelectFile = (event, files) => {
        if (files.length > config.File_upload.numFiles) { 
            const msg = "Only " + config.File_upload.numFiles + " file can be uploaded at a time";
            event.target.value = null; // discard selected file
            toast.warn(msg);
            return false;
        }
        return true;
    };

    checkMimeType = (event, files) => {
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

    checkFileSize = (event, files) => {
        let size = config.File_upload.sizeLimit;
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
            <div className="modal" id="uploadModal" role="dialog" data-testid="uploadModal"
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
                                    <input type="text" className="form-control" id="title" data-testid="title"
                                    onChange={this.changeTitleHandler}
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