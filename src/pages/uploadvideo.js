import Header from "../components/js/header";
import axios from "axios";
import {useState} from "react";
import Sidebar from "../components/js/sidebar";
import {useCookies} from "react-cookie";
import {useEffect} from "react";

const Uploadvideo = () => {
    const [videoSource, setVideoSource] = useState(null)
    const [videoCaption, setVideoCaption] = useState(null)
    const [captionLength, setCaptionLength] = useState(0)
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
            console.log("uploaded a video")
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

        <div className="upload-video-container" >
            <form className="upload-video-form" onSubmit={event => handleVideoUpload(username)} >
                <div className="upload-modal-container">
                    <div className="upload-modal-header-container" >
                        <h1 className="upload-video-header">
                            Upload video
                        </h1>
                        <p className="upload-video-subheading">
                            Post a video to your account
                        </p>
                    </div>
                    <div className="upload-options-container">

                    <div className="placeholder-drag-dop-input">
                        <h3>
                            Cover
                        </h3>
                        <video className="placeholder-image" src={videoSource}>

                        </video>
                    </div>
                    <div className="upload-input-container">
                <h3>
                    Video Link
                </h3>

                <input
                    type="text"
                    id="video-source"
                    placeholder="video url"
                    onChange={event => setVideoSource(event.target.value)}
                />

                <h3 >
                    Video Caption
                </h3>
                        <div className="comment-input-counter">
                            <p className="comment-input">
                                {(videoCaption === null) ? (<p>
                                    0
                                </p>) : (videoCaption.length)} / 200
                            </p>
                        </div>
                <input
                    type="text"
                    id="video-caption"
                    placeholder="caption"
                    onChange={event => {setVideoCaption(event.target.value)}}/>
                </div>
                </div>
                    <div className="submit-form-buttons-container">
                        <input  type="submit" value="submit" onSubmit={event => handleVideoUpload(username)}>

                        </input>
                    </div>
                </div>

            </form>

        </div>
        </>
    )
}

export default Uploadvideo