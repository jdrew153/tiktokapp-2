import '../styles/components.css'
import {useState} from "react";

const Minivideocard = ({ image_url, video_caption }) => {

    return(
        <>
        <div className="mini-video-card-container">
            <div className="individual-img-wrapper">
                <video className="individual-img"
                       src={image_url}
                       alt="loading"
                       onMouseEnter={event => event.target.play()}
                       onMouseOut={event => event.target.pause()}
                       loop={true}
                       muted={true}
                />
            </div>
            <div className="mini-video-card-caption">
                <p>
                    {video_caption}
                </p>
            </div>
        </div>

        </>
    )
}

export default Minivideocard