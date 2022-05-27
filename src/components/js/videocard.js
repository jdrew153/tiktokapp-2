import "../../App.css"
import { AiFillHeart } from "react-icons/ai"
import { BsChatDotsFill} from "react-icons/bs"
import { TiArrowForward } from "react-icons/ti"
import axios from "axios";
import { useEffect, useState} from "react";
import videocard from "./videocard";



const Videocard = ({ profile_pic_url, profile_description, video, username, user_id, video_id, postusername, numLikes,usersLikedVids }) => {

    const [liked, setLiked] = useState(false)

    const handleLike = async (postusername, video_id) => {
        try {
            const response = await axios.put(`http://localhost:8000/like/${postusername}/${video_id}`)
            setLiked(true)

        } catch (error) {
            console.log(error)
        }

    }

    const handleUnlike = () => {
        setLiked(false)
        console.log(liked)
    }

    useEffect(() => {

    }, [liked])

    return (
       <>
                   <div className="main-video-container">
                       <div className="profile-picture-spacer-video">
                           <img className="video-profile-picture" src={profile_pic_url} alt="loading"
                               />
                       </div>
                       <div className="actual-video-container"
                            >
                           <div className="video-tags-container">
                               <a href={`/user-page/${user_id}`}>
                               <h3>
                                   {username}
                               </h3>
                               <div className="tag-container">
                                   <p className="tags">
                                       {profile_description}
                                   </p>
                               </div>
                               </a>
                               <div className="video-likes-container"
                               >
                                   <video className="main-video"
                                          muted={true}
                                          controls={true}
                                          onMouseOver={event => event.target.play()}
                                          onMouseOut={event => event.target.pause()}
                                          src={video}
                                   />
                                   <div className="likes-container">
                                       {(video_id in usersLikedVids) ? (<AiFillHeart className="icon-likes-red" onClick={event => handleUnlike}/> ) : (
                                       <AiFillHeart className="icon-likes" onClick={event => handleLike(postusername, video_id)}/>)}
                                       <p>
                                           {numLikes}
                                       </p>
                                   </div>
                                   <div className="comments-container">
                                       <BsChatDotsFill className="icon-comment"></BsChatDotsFill>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>

       </>
    )
}
export default Videocard