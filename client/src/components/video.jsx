import React, { Component } from "react";
import Moment from 'moment';
import config from "./../config.json";

class Video extends Component {

    render() {
        Moment.locale('en');

        return (
            <div className="col">
                <div className="card shadow-sm">
                    <a href={`${config.Server_URL}/${this.props.filename}`}>
                        <img className="bd-placeholder-img card-img-top" width="100%" height="225" 
                        src={`${config.Server_URL}/${this.props.image}`}
                        preserveAspectRatio="xMidYMid slice" 
                        focusable="false" alt={this.props.title} />
                    </a>
                    <div className="card-body">
                        <p className="card-text">{this.props.title}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{Moment(this.props.datetime).format('d MMM YYYY')}</small>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Video;