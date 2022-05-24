import {AiOutlineHome} from "react-icons/ai";
import {BsCameraVideo, BsPeople} from "react-icons/bs";
import {VscSmiley} from "react-icons/vsc";
import {IoGameControllerOutline, IoPawOutline, IoPizzaOutline} from "react-icons/io5";
import Suggestedaccounts from "./suggestedaccounts";
import Videocard from "./videocard";
import {useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const Sidebar = ({ loggedIn }) => {

    const [cookies, setCookie, removeCookie] = useCookies(null)
    const username = cookies.username



    let navigator = useNavigate()

    const handleLogInRedirect =() => {
        navigator('/login')
        removeCookie('username')
        window.location.reload()

    }
    const handleLogOut = () => {
        loggedIn = false
        navigator('/login')
        window.location.reload()

    }
    return (
        <>
            <div className="sidebar-container">
                <div className="page-navigator-container">
                    <div className="home-container">
                        <AiOutlineHome className="home"/>
                        <a href={'/feed'}>
                            <h3>
                                For You
                            </h3>
                        </a>

                    </div>
                    <a href={`/followed-user/${username}`}>
                    <div className="following-container">
                        <BsPeople className="following"/>
                        <h3>
                            Following
                        </h3>
                    </div>
                    </a>
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

                    {loggedIn ? (<div className="login-button-sidebar-container-hidden">
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

                    </div>

                ) : <div className="test">
                    fuck you log in pussy
                </div>
            }
        </>
    )
}

export default Sidebar