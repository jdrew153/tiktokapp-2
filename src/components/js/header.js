
import {FiSearch} from "react-icons/fi";
import {HiDotsVertical} from "react-icons/hi";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {AiOutlinePlus} from "react-icons/ai"
import {IoChatboxEllipsesSharp} from "react-icons/io5"
import {IoPaperPlaneOutline} from "react-icons/io5"
import Notificationcenter from "./notificationcenter";
import Badge from '@mui/material/Badge';
import axios from "axios";

const Header = () => {
    const [loggedIn, setIsLoggedIn] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const [numNotifications, setNumNotifications] = useState(0)


    const username = cookies.username
    const pic = cookies.profile_picture

    let navigator = useNavigate()

    const handleLogInRedirect =() => {
        navigator('/login')
        removeCookie('username')
        removeCookie('profile_picture')
        window.location.reload()

    }
    const handleLogOut = () => {
        setIsLoggedIn(false)
        removeCookie('profile_picture')
        navigator('/login')
        window.location.reload()
    }

    const handleGetNumsNotifications = async (username) => {
        console.log('handleGetNumsNotifications')
        try {
            const response = await axios.get(`http://localhost:8000/specific_user${username}`)
            const notificationArray = response.data.notifications

            let notifications = null
            for (let i=0; i < notificationArray.length; i++) {
                if (notificationArray[i].acknowledged === false) {
                    notifications += 1
                }
            }
            setNumNotifications(notifications)

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {

            if(username) {
                setIsLoggedIn(true)
            }else {
                setIsLoggedIn(false)
            }
        }, []

    )
    useEffect(() => {
        handleGetNumsNotifications(username)
    }, [])


    return (
        <>
            <div className="header-container">
                <a href={`/followed-user/${username}`}>
                <div className="logo-container">
                    <img className="logo"
                         src="http://honors.auburn.edu/wp-content/uploads/2020/10/TikTok-Logo.jpg"
                         alt="loading"/>
                </div>
                </a>
                <div className="search-bar-container">
                    <input className="search" placeholder="Search accounts"/>
                    <FiSearch className="search-icon"/>
                </div>
                <div className="buttons-container">
                    <div className="upload-button-container">
                        <a href={`/upload-video/${username}`}>
                            <AiOutlinePlus className="plus-button-icon"/>
                        <button className="upload-button">
                            Upload
                        </button>
                        </a>
                    </div>
                    {loggedIn &&
                    <div className="notifications-container" >
                        {(numNotifications > 0) ?
                            (<Badge badgeContent={numNotifications} color={"warning"} max={10}>

                        <IoChatboxEllipsesSharp className="notifications-icon" onClick={event => setShowNotifications(true)}/>
                        </Badge>) : (<IoChatboxEllipsesSharp className="notifications-icon" onClick={event => setShowNotifications(true)}/>
                            )}
                        {(showNotifications === true) ? (<Notificationcenter/>) : (<div/>)}
                    </div>}
                    {(loggedIn === true) ?
                        (<div className="login-button-container">
                            <button className="login-button" onClick={handleLogOut}>
                                Log Out
                            </button>
                        </div>) : (<div className="login-button-container">
                            <button className="login-button" onClick={handleLogInRedirect}>
                                Log In
                            </button>
                        </div>)

                    }
                    <div className="messaging-button-container">
                        <a href={`/messages/${username}`}>
                        <IoPaperPlaneOutline className="messaging-button-icon"/>
                        </a>
                    </div>
                    <div className="more-button-container" onClick={event => setShowNotifications(false)}>
                        <HiDotsVertical className="more"/>
                    </div>
                </div>
                {loggedIn &&
                    (<div className="user-profile">
                            <p>
                                {username}
                            </p>
                        </div>
                    )

                }
                {loggedIn && (<img className="profile-picture" src={pic} alt="loading"/>)}
            </div>
        </>
    )
}

export default Header