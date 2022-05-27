import Videocard from "../components/js/videocard";
import {useCookies, withCookies} from "react-cookie";
import {useState, useEffect} from "react";
import Sidebar from "../components/js/sidebar";
import Header from "../components/js/header";
import axios from "axios";
import { AiFillHeart } from "react-icons/ai"
import { BsChatDotsFill} from "react-icons/bs"
import { TiArrowForward } from "react-icons/ti"

const Followeduservideos = () => {
    const [cookies, setCookies, removeCookies] = useCookies()
    const [loggedIn, setIsLoggedIn] = useState(false)
    const [users, setUsers] = useState([])
    const [cookieLikedVidArray, setcookieLikedVidArray] = useState([])


    const username = cookies.username

    function getRandomNums(max, min) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)

    }

    const handleGetFollowedVideos = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8000/get-all-followers/${username}`)
            setUsers(response.data)

            let randomVidIndx = null
            const retUserRandVid = []
            response.data.forEach((user) => {
                randomVidIndx = getRandomNums(user.videos.length, 0)
                retUserRandVid.push( {
                    "username" : user.username,
                    "profile_description": user.profile_description,
                    "profile_pic_url" : user.profile_pic_url,
                    "video" : user.videos[randomVidIndx].source,
                    "likes" : user.videos[randomVidIndx].likes,
                    "video_id" : user.videos[randomVidIndx].video_id,
                    "caption" : user.videos[randomVidIndx].caption,
                    "liked_videos" : user.liked_videos

                })
            })
            setUsers(retUserRandVid)
            if (users.video_id in cookieLikedVidArray) {
                console.log(users.video_id)
            }



        } catch (error) {
            console.log(error)
        }
    }

    const handleGetCookieLikedVideos = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8000/liked-videos/${username}`)
            setcookieLikedVidArray(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleisLoggedIn = () => {
        if (username) {
            setIsLoggedIn(true)
        }
    }
    useEffect(() => {
        handleGetCookieLikedVideos(username)
        handleGetFollowedVideos(username)
        handleisLoggedIn(username)

    }, [])


    return (
        <>

            <Header/>
            <Sidebar loggedIn={loggedIn}/>
        <div className="followed-user-videos-container">

            {users.map((i) =>

                <Videocard username={i.username}
                           profile_description={i.caption}
                           profile_pic_url={i.profile_pic_url}
                           video={i.video}
                           user_id={i.user_id}
                           postusername={username}
                           video_id={i.video_id}
                           usersLikedVids={cookieLikedVidArray}
                           numLikes={i.likes}

                />
            )}
        </div>
            </>
    )
}

export default Followeduservideos