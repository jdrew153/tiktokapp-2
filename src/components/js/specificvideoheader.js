import { AiFillHeart } from "react-icons/ai"
import { BsChatDotsFill} from "react-icons/bs"
import axios from "axios";
import {useEffect} from "react";
import {useState} from "react";
import {useCookies} from "react-cookie";
import {useParams} from "react-router-dom";

const Specificvideoheader = ({ profile_pic, profile_username, numLikes, numComments }) => {
    const [followedUsers, setFollowedUsers] = useState([])
    const [isFollowed, setisFollowed] = useState(false)
    const [cookies, setCookies, removecookies] = useCookies()

    const username = cookies.username
    const {user_id} = useParams()


    const getFollowers = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8000/get-followers/${username}`)
            setFollowedUsers(response.data)

        } catch (error) {
            console.log(error)
        }
    }
    const followedUserComparisonArray = []
    followedUsers.forEach(follower => {
        followedUserComparisonArray.push(follower.user_id)
    })

    const handledisFollowed = (user_id) => {
        if (followedUserComparisonArray.includes(user_id)) {
            setisFollowed(true)
        } else {
            console.log('fuck')
        }
    }

    useEffect(() => {
        getFollowers(username)
    },[])



    useEffect(()=> {
        handledisFollowed(user_id)
    },[followedUserComparisonArray])
    console.log(isFollowed)
    return (
        <>
        <div className="specific-video-profile-header">
            <img className="smaller-profile-picture" src={profile_pic} alt="loading"/>
            <div>
                <h3 className="small-username">
                    {profile_username}
                </h3>
                <p className="alt-small-username">
                    {profile_username}
                </p>
            </div>

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
            {isFollowed ? (<button className="small-follow-button">
                Message
            </button>) : (<button className="message-button">
                Follow
            </button>)}

        </>
    )
}

export default Specificvideoheader