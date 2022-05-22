import { AiFillHeart } from "react-icons/ai"
import { BsChatDotsFill} from "react-icons/bs"

const Specificvideoheader = ({ profile_pic, username, numLikes, numComments }) => {
    return (
        <>
        <div className="specific-video-profile-header">
            <img className="smaller-profile-picture" src={profile_pic} alt="loading"/>
            <div>
                <h3 className="small-username">
                    {username}
                </h3>
                <p className="alt-small-username">
                    {username}
                </p>
            </div>
            <button className="small-follow-button">
                Follow
            </button>
        </div>
        <div className="icons-container">
            < div className="small-likes-container">
                <AiFillHeart className="small-likes-icon"/>
            </div>
            <p className="small-icon-description">
                {numLikes}
            </p>
            <div className="small-comments-container">
                <BsChatDotsFill className="small-comments-icon"/>
            </div>
            <p className="small-icon-description">
                {numComments}
            </p>

        </div>
        </>
    )
}

export default Specificvideoheader