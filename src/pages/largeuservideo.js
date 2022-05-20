import axios from "axios";
import {useParams} from "react-router-dom";
import {useState,useEffect} from "react";

const Largeuservideo = () => {
    const { user_id } = useParams()
    const { video_id } = useParams()

    const [largevideo, setLargeVideo] = useState(null)
    const [postTime, setPostTime] = useState(null)

    const handleLargeVideoRequest = async (user_id) => {
        const response = await axios.get(`http://localhost:8000/largevideo/${user_id}`)
        const video_array = response.data

        video_array.forEach((video) => {
          if (video.video_id == video_id) {
              setLargeVideo(video.source)
              var current = new Date()


          } else {
              console.log('not the video youre looking for')
          }
        })
    }

    useEffect(() => {
        handleLargeVideoRequest(user_id)
    },[video_id])



    return (
        <>
        <div className="specific-video-background">
        <div className="large-video-background">
            <video className="large-video"
                src={largevideo}>
            </video>
        </div>
            <div className="large-video-wrapper">
                <div className="large-video-container">
                    <video className="large-video-front"
                           src={largevideo}
                           controls={true}>
                    </video>
                </div>

            </div>
        </div>

        </>
    )
}

export default Largeuservideo