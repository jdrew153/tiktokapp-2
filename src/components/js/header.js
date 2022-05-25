
import {FiSearch} from "react-icons/fi";
import {HiDotsVertical} from "react-icons/hi";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const [loggedIn, setIsLoggedIn] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(null)

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

    useEffect(() => {

            if(username) {
                setIsLoggedIn(true)
            }else {
                setIsLoggedIn(false)
            }
        }

    )
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
                        <a href={`/upload-video/${username}`}>
                        <button className="upload-button">
                            Upload
                        </button>
                        </a>
                    </div>
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
                {loggedIn && (<img className="profile-picture" src={pic} alt="loading"/>)}
            </div>
        </>
    )
}

export default Header