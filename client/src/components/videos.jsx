import React, { Component } from "react";
import UploadModal from "./uploadModal";
import Video from "./video";
import axios from "axios";
import config from "./../config.json";

class Videos extends Component {

    state = {
        data: null
    }

    componentDidMount() {
        this.fetchResult();
    }

    fetchResult = () => {
        axios.get(config.Server_URL + "/readDB")
        .then(res => {
            if(res.data) {
                this.setState({
                    data: res.data
                });
                //console.log(res);
            }
        });
    };

    render() {
        if(this.state.data === null) {
            return (
                <main>
                    <div data-testid="videoList" className="album py-5 bg-light">
                        <div className="container">
                            <h4>There are no videos uploaded yet.</h4>
                        </div>
                    </div>
                    <UploadModal onUploaded={ () => this.fetchResult() } />
                </main>
            );
        }
        else {
            return (
                <main>
                    <div data-testid="videoList" className="album py-5 bg-light">
                        <div className="container">
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                                {this.state.data.map(data => 
                                <Video 
                                    key={data.id}
                                    title={data.title}
                                    image={data.image}
                                    filename={data.filename}
                                    datetime={data.datetime}
                                />)}
                            </div>
                        </div>
                    </div>
                    <UploadModal onUploaded={ () => this.fetchResult() } />
                </main>
            );
        }
    }
}
 
export default Videos;