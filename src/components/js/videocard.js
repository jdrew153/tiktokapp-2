import "../../App.css"
import { AiFillHeart } from "react-icons/ai"
import { BsChatDotsFill} from "react-icons/bs"
import { TiArrowForward } from "react-icons/ti"
import axios from "axios";
import { useEffect, useState} from "react";



const Videocard = ({ profile_pic_url, profile_description, video }) => {

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
                               <div className="tag-container">
                                   <p className="tags">
                                       {profile_description}
                                   </p>
                               </div>
                               <div className="video-likes-container"
                               >
                                   <video className="main-video"
                                          muted={true}
                                          controls={true}
                                          onMouseOver={event => event.target.play()}
                                          onMouseOut={event => event.target.pause()}
                                          src={video}
                                   />
                               </div>
                           </div>
                       </div>
                   </div>

       </>
    )
}
export default Videocard