import "../App.css"
import { AiFillHeart } from "react-icons/ai"
import { BsChatDotsFill} from "react-icons/bs"
import { TiArrowForward } from "react-icons/ti"
import axios from "axios";
import { useEffect, useState} from "react";


const Videocard = () => {

    const [items, setItems] = useState(null)

    const HandleVidRequest = async () => {
        try {
            const response = await axios.get("http://localhost:8000/users")
            const data = response.data
            setItems(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        HandleVidRequest()
    }, [items])

    const feed = items

    if (!(feed == null)) {
    return (
        items.map((accounts) => (
            <div className="main-video-container">
                <div className="profile-picture-spacer-video">
                    <img className="video-profile-picture" src={accounts.profile_pic_url} alt="loading"/>

                </div>
                <div className="actual-video-container">
                    <div className="video-tags-container">
                        <div className="tag-container">
                            <p className="tags">
                                {accounts.profile_description}
                            </p>
                        </div>
                        <div className="video-likes-container">
                            <video className="main-video" src={accounts.video} controls={true} autofocus={true} autoPlay={true} muted={true}/>
                            <div className="video-options">
                                <div className="likes-container">
                                    <div className="likes-icon">
                                        <AiFillHeart className="icon-likes"/>
                                        <p className="number-likes">
                                            {accounts.likes}
                                        </p>
                                    </div>
                                </div>
                                <div className="comments-container">
                                    <div className="comments-icon">
                                        <BsChatDotsFill className="icon-comment"/>
                                        <p className="number-comments">
                                            {accounts.comments}
                                        </p>
                                    </div>
                                </div>
                                <div className="shares-container">
                                    <div className="shares-icon">
                                        <TiArrowForward className="icon-shares"/>
                                        <p className="number-shares">
                                            Share
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))
    )
    }
}
export default Videocard