import '../styles/components.css'
import {FiPlay} from "react-icons/fi";
const Minivideocard = ({ image_url, video_caption, views }) => {

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
                >

                </video>
                <div className="mini-card-views">
                    <FiPlay id="play-icon"/>
                    <p>
                        {views ? (<p className="play-text">
                            {views}
                        </p>): (<p></p>)}
                    </p>
                </div>



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