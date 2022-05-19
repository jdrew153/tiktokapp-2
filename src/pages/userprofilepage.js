import '../components/styles/components.css'
import Minivideocard from "../components/js/minivideocard"
import Userprofileheader from "../components/js/userprofileheader";
import image from '../assets/Katlyn-Styles.jpg'
import Header from "../components/js/header";
import Sidebar from "../components/js/sidebar";
import axios from "axios";
import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";

const Userprofilepage =  () => {

    const [profile, setProfile] = useState(null)

    const { user_id } = useParams()
    const handleProfileRequest = async (user_id) => {
        try {
            const response = await axios.get(`http://localhost:8000/user_videos/${user_id}`)
            setProfile(response.data)
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        handleProfileRequest(user_id)
    }, [])


    return(
        <> {
            profile &&
            <>

            <Header/>
            <Sidebar/>

            <div className="overall-container">

            <div className="header-header-container">
            <Userprofileheader profile_picture={image}
            username={profile.user_name}
            profile_description={profile.profile_description}
            followed={"32"}
            followers={"45"}
            likes={"300.0B"}/>
            </div>

            <div className="three-column-container">
            <div className="mini-video-card-grid-wrapper">
            <div className="grid-container">
        {profile.videos.map((video) => (
            <Minivideocard image_url={video.source} video_caption={video.caption}/>
            ))

        }

            </div>

            </div>
            </div>
            </div>
            </>
        } </>


    )
}
export default Userprofilepage