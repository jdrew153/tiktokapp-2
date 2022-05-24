
import Videocard from "../components/js/videocard";
import {useNavigate} from "react-router-dom";
import {useCookies, Cookies} from "react-cookie";
import Header from "../components/js/header";
import Sidebar from "../components/js/sidebar";
import { useState, useEffect } from "react"



const Feed = () => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [cookies, setCookies, removeCookies] = useCookies()

    const username = cookies.username

    const userLoggedIn = (username) => {
        if (username) {
            setLoggedIn(true)
        }
    }


    useEffect(() => {
        userLoggedIn(username)
    }, [username])


    return (
                <>
                   <Header/>
                    <Sidebar loggedIn={loggedIn}/>
                    <Videocard/>



                </>

    )
}

export default Feed