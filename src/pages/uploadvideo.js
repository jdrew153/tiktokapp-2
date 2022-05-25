import Header from "../components/js/header";
import axios from "axios";
import {useState} from "react";
import Sidebar from "../components/js/sidebar";
import {useCookies} from "react-cookie";
import {useEffect} from "react";

const Uploadvideo = () => {
    const [videoSource, setVideoSource] = useState(null)
    const [videoCaption, setVideoCaption] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)
    const [cookies, setCookies, removeCookies] = useCookies()

    const username = cookies.username

    const userLoggedIn = (username) => {
        if (username) {
            setLoggedIn(true)
        }
    }
    const handleVideoUpload = async (username) => {

        try {
            const response = await axios.put(`http://localhost:8000/upload-video/${username}`, {videoCaption, videoSource})
            console.log(response)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        userLoggedIn(username)
    }, [username])

    return (
        <>
       <Header/>
            <Sidebar loggedIn={loggedIn}/>
        <div className="upload-video-container" >
            <form className="upload-video-form" onSubmit={event => handleVideoUpload(username)}>
                <h3>
                    Video Link
                </h3>
                <input
                    type="text"
                    id="video-source"
                    placeholder="video url"
                    onChange={event => setVideoSource(event.target.value)}
                />
                <h3>
                    Video Caption
                </h3>
                <input
                    type="text"
                    id="video-caption"
                    placeholder="caption"
                    onChange={event => setVideoCaption(event.target.value)}/>
                <button className="login-button" form="upload-video-form" onClick={event => handleVideoUpload(username)}>
                    Upload
                </button>

            </form>

        </div>
        </>
    )
}

export default Uploadvideo