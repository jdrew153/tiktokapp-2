import Videocard from "../components/js/videocard";
import {useCookies} from "react-cookie";
import {useState, useEffect} from "react";
import Sidebar from "../components/js/sidebar";
import Header from "../components/js/header";
import axios from "axios";

const Followeduservideos = () => {
    const [cookies, setCookies, removeCookies] = useCookies()
    const [loggedIn, setIsLoggedIn] = useState(false)
    const [users, setUsers] = useState([])
    const [randVideo, setRandVideo] = useState(null)


    const username = cookies.username

    function getRandomNums(max) {
        return Math.random() * (max)
    }

    const handleGetFollowedVideos = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8000/get-all-followers/${username}`)
            setUsers(response.data)

            response.data.forEach((user) =>

                setRandVideo(user.videos.length - 1)
            )



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
        handleGetFollowedVideos(username)
        handleisLoggedIn()
    }, [])




    return (
        <>
            <Header/>
        <Sidebar loggedIn={loggedIn}/>
        <div>
            {users.map((i) =>
                <a href={`/user-page/${i.user_id}`}>
                <Videocard profile_description={i.profile_description} profile_pic_url={i.profile_pic_url} video={i.videos[0].source}/>
                </a>
            )}
        </div>
            </>
    )
}

export default Followeduservideos