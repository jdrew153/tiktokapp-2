import { FiSearch } from "react-icons/fi"
import { AiOutlineHome } from "react-icons/ai"
import { BsPeople } from "react-icons/bs"
import { BsCameraVideo } from "react-icons/bs"
import { HiDotsVertical } from "react-icons/hi"
import { VscSmiley } from "react-icons/vsc"
import { IoGameControllerOutline } from "react-icons/io5"
import { IoPizzaOutline } from "react-icons/io5"
import { IoPawOutline } from "react-icons/io5"
import Suggestedaccounts from "../components/suggestedaccounts";
import Videocard from "../components/videocard";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies, Cookies} from "react-cookie";



const Feed = () => {
    const [loggedIn, setIsLoggedIn] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(null)

    const username = cookies.username
    const pic = cookies.profile_picture

    let navigator = useNavigate()

    const handleLogInRedirect =() => {
        navigator('/login')
        removeCookie('username')
        window.location.reload()

    }
    const handleLogOut = () => {
        setIsLoggedIn(false)
        navigator('/login')
        window.location.reload()

    }

  useEffect(() => {

      if(username) {
          setIsLoggedIn(true)
      }else {
          setIsLoggedIn(false)
      }
      }

  )
   console.log(pic)




    return (
                <>
                    <div className="header-container">
                        <div className="logo-container">
                            <img className="logo"
                                 src="http://honors.auburn.edu/wp-content/uploads/2020/10/TikTok-Logo.jpg"
                                 alt="loading"/>
                        </div>
                        <div className="search-bar-container">
                            <input className="search" placeholder="Search accounts"/>
                            <FiSearch className="search-icon"/>
                        </div>
                        <div className="buttons-container">
                            <div className="upload-button-container">
                                <button className="upload-button">
                                    Upload
                                </button>
                            </div>
                            {(loggedIn == true) ?
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
                            <div className="more-button-container">
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
                        {loggedIn && (<img className="profile-picture" src={pic}/>)}
                    </div>

                    <div className="sidebar-container">
                        <div className="page-navigator-container">
                            <div className="home-container">
                                <AiOutlineHome className="home"/>
                                <h3>
                                    For You
                                </h3>
                            </div>
                            <div className="following-container">
                                <BsPeople className="following"/>
                                <h3>
                                    Following
                                </h3>
                            </div>
                            <div className="live-container">
                                <BsCameraVideo className="live"/>
                                <div className="live-text">
                                    <h3>
                                        LIVE
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="login-sidebar-container">
                            {loggedIn ? (<div className="login-text-container">
                                <p>
                                    Keep looking at videos pussy

                                </p>
                            </div>) : (<div className="login-text-container">
                                <p>
                                    Log in to follow creators, like videos, and view comments.
                                </p>
                            </div>)}

                            {loggedIn ? (<div className="login-button-sidebar-container">
                                <button className="login-sidebar" onClick={handleLogInRedirect}>
                                    Log Out
                                </button>
                            </div>):(
                                <div className="login-button-sidebar-container">
                                    <button className="login-sidebar" onClick={handleLogInRedirect}>
                                        Log In
                                    </button>
                                </div>
                            )}

                        </div>
                        <div className="popular-topics-container">
                            <p className="topic-header">
                                Popular topics
                            </p>
                            <div className="popular-topic-container">
                                <VscSmiley className="popular-topic-icon"/>
                                <div className="topic-text-container">
                                    <p className="topic-text">
                                        Comedy
                                    </p>
                                </div>
                            </div>
                            <div className="popular-topic-container">
                                <IoGameControllerOutline className="popular-topic-icon"/>
                                <div className="topic-text-container">
                                    <p className="topic-text">
                                        Gaming
                                    </p>
                                </div>
                            </div>
                            <div className="popular-topic-container">
                                <IoPizzaOutline className="popular-topic-icon"/>
                                <div className="topic-text-container">
                                    <p className="topic-text">
                                        Food
                                    </p>
                                </div>
                            </div>
                            <div className="popular-topic-container">
                                <IoPawOutline className="popular-topic-icon"/>
                                <div className="topic-text-container">
                                    <p className="topic-text">
                                        Animals
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="sidebar-profile-row-container">
                            <p className="topic-header">
                                Suggested Accounts
                            </p>
                            <Suggestedaccounts/>
                        </div>
                    </div>
                    {loggedIn ?
                        ( <div className="test">
                                <Videocard  key={username} />
                        </div>

                        ) : <div className="test">
                            fuck you log in pussy
                        </div>
                    }


                </>

    )
}

export default Feed