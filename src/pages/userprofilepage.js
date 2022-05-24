import '../components/styles/components.css'
import Minivideocard from "../components/js/minivideocard"
import Userprofileheader from "../components/js/userprofileheader";
import Header from "../components/js/header";
import Sidebar from "../components/js/sidebar";
import axios from "axios";
import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import {useCookies} from "react-cookie";
import {BsPeople} from "react-icons/bs"

const Userprofilepage =  () => {

    const [profile, setProfile] = useState(null)
    const [followed, setFollowed] = useState(false)
    const [followedUsers, setFollowedUsers] = useState([])
    const [cookies, setcookies, removeCookies] = useCookies()

    const username = cookies.username
    const { user_id } = useParams()
    const [loggedIn, setLoggedIn] = useState(false)


    const userLoggedIn = (username) => {
        if (username) {
            setLoggedIn(true)
        }
    }


    const handleProfileRequest = async (user_id) => {
        try {
            const response = await axios.get(`http://localhost:8000/user_videos/${user_id}`)
            setProfile(response.data)
        } catch (e) {
            console.log(e)
        }

    }
    const getFollowers = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8000/get-followers/${username}`)
            setFollowedUsers(response.data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleFollow = async (username, user_id) => {
        try {
            const response = await axios.put(`http://localhost:8000/add-a-follower/${username}/${user_id}`)
            setFollowed(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteFollower = async (username, user_id) => {
        try {
            const response = await axios.put(`http://localhost:8000/unfollow-a-user/${username}/${user_id}`)

        } catch (error) {
            console.log(error)
        }
    }

    const followedUserComparisonArray = []
    followedUsers.forEach(follower => {
        followedUserComparisonArray.push(follower.user_id)
    })

    useEffect(() => {
        handleProfileRequest(user_id)
        getFollowers(username)
        userLoggedIn(username)

    }, [followed])

    useEffect(() => {
        getFollowers(username)
    }, [followedUserComparisonArray])






    return<> {
        profile &&
        <>

        <Header/>

        <Sidebar loggedIn={loggedIn}/>

        <div className="overall-container">

        <div className="header-header-container">
        <Userprofileheader profile_picture={profile?.profile_pic_url}
        username={profile?.username}
        profile_description={profile?.profile_description}
        followed={profile?.followed_users.length}
        followers={"45"}
        likes={"300.0B"}
        />
            {!(profile?.username == username) ? (followedUserComparisonArray.includes(user_id)? <> <button className="message-button" >
                    Message
                </button>  <BsPeople onClick={event => handleDeleteFollower(username, user_id)}/> </>: <button className="follow-button" onClick={event => handleFollow(username, user_id)}>
                Follow
            </button>) : (<button className="follow-button" >
                Edit Profile
            </button>)}
        </div>

        <div className="three-column-container">
        <div className="mini-video-card-grid-wrapper">
        <div className="grid-container">
    {profile.videos.map((video) => <a href={`/${profile.user_id}/${video.video_id}`}>
        <Minivideocard image_url={video?.source} video_caption={video?.caption}/>
        </a>)

    }

        </div>

        </div>
        </div>
        </div>
        </>
    } </>
}
export default Userprofilepage