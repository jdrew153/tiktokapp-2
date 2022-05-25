import Videocard from "../components/js/videocard";
import {useCookies} from "react-cookie";
import {useState, useEffect} from "react";
import Sidebar from "../components/js/sidebar";
import Header from "../components/js/header";
import axios from "axios";
import {queries} from "@testing-library/react";

const Followeduservideos = () => {
    const [cookies, setCookies, removeCookies] = useCookies()
    const [loggedIn, setIsLoggedIn] = useState(false)
    const [users, setUsers] = useState([])
    const [randVideo, setRandVideo] = useState(null)


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
        handleisLoggedIn(username)
    }, [])
    console.log(randVideo)




    return (
        <>
            <Header/>
        <Sidebar loggedIn={loggedIn}/>
        <div>
            {users.map((i) =>
                <a href={`/user-page/${i.user_id}`}>
                <Videocard profile_description={i.profile_description} profile_pic_url={i.profile_pic_url} video={i.videos[randVideo].source}/>
                </a>
            )}
        </div>
            </>
    )
}

export default Followeduservideos