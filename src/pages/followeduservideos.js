import Videocard from "../components/js/videocard";
import {useCookies, withCookies} from "react-cookie";
import {useState, useEffect} from "react";
import Sidebar from "../components/js/sidebar";
import Header from "../components/js/header";
import axios from "axios";
import { useQuery } from "react-query";


const Followeduservideos = options => {
    const [cookies, setCookies, removeCookies] = useCookies()
    const [loggedIn, setIsLoggedIn] = useState(false)
    const [users, setUsers] = useState([])
    const [cookieLikedVidArray, setcookieLikedVidArray] = useState([])
    const [commentsArray, setComments] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false)





    const username = cookies.username

    function getRandomNums(max, min) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)

    }

    const handleGetFollowedVideos = async (username) => {
        // console.log('getting the followed videos')
        try {
            const response = await axios.get(`http://localhost:8000/get-all-followers/${username}`)

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
                    "liked_videos" : user.liked_videos,
                    "user_id": user.user_id,
                    "comments": user.videos[randomVidIndx].comments,
                    "views": user.videos[randomVidIndx].views
                })
            })

            setUsers(retUserRandVid)
            if (users.video_id in cookieLikedVidArray) {
                console.log(users.video_id)
            }
            return retUserRandVid
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetCookieLikedVideos = async (username) => {
        console.log('getting the users liked videos')

        try {
            const response = await axios.get(`http://localhost:8000/liked-videos/${username}`)
            setcookieLikedVidArray(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleisLoggedIn = () => {
        console.log('is the user logged in?')

        if (username) {
            setIsLoggedIn(true)
        }
    }
    const handleGetComment = async () => {
        console.log('getting comments')
        try {
            const response = await axios.get(`http://localhost:8000/get-all-comments`)
            const testArray = []
            response.data.forEach((i) => {
                testArray.push(
                     i.comments.length
                )
            })
            setComments(testArray)
            return testArray
        } catch (error) {
            console.log(error)
        }
    }



    // useEffect(() => {
    //     handleGetFollowedVideos(username)
    // }, [])
    const {data} = useQuery(['followed-users', username],()=> handleGetFollowedVideos(username) )


    useEffect( () => {
        handleisLoggedIn(username)
    }, [username])
    useEffect(() => {
        handleGetComment()
        handleGetCookieLikedVideos(username)
        console.log('rendered comments')
    }, [])







    return (
        <>
            {data &&
                <>
                <Header/>
                <Sidebar loggedIn={loggedIn}/>
                <div className="followed-user-videos-container">

            {data.map((i) =>


                <Videocard username={i.username}
                profile_description={i.caption}
                profile_pic_url={i.profile_pic_url}
                video={i.video}
                user_id={i.user_id}
                postusername={username}
                video_id={i.video_id}
                usersLikedVids={cookieLikedVidArray}
                numLikes={i.likes}
                likedusername={i.username}
                           comments={i.comments}
                           views={i?.views}







                />
                )}
                </div>
                    </>
            }
            </>
    )
}

export default Followeduservideos