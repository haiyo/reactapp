import React, { Component } from "react";
import Video from "./video";
import axios from "axios";
import config from "./../config.json";

class Videos extends Component {

    state = {
        data: null
    }

    componentDidMount() {
        axios.get(config.Server_URL + "/readDB")
        .then(res => {
            if(res.data) {
                this.setState({
                    data: res.data
                });
                console.log(res);
            }
        });
    }

    render() {
        if(this.state.data === null) {
            return (
                <main>
                    <div className="album py-5 bg-light">
                        <div className="container">
                            <h4>There are no videos uploaded yet.</h4>
                        </div>
                    </div>
                </main>
            );
        }
        else {
            return (
                <main>
                    <div className="album py-5 bg-light">
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
                </main>
            );
        }
    }
}
 
export default Videos;