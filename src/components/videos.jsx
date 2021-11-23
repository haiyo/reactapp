import React, { Component } from "react";
import Video from "./video";
import Data from "../db.json";

class Videos extends Component {

    render() {
        if(Data.length === undefined) {
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
                                {Data.map(data => 
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