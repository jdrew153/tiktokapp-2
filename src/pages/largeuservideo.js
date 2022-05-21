import axios from "axios";
import {useParams} from "react-router-dom";
import {useState,useEffect} from "react";
import {AiOutlineCloseCircle} from 'react-icons/ai'
import Comment from "../components/js/comment";


const Largeuservideo = () => {
    const { user_id } = useParams()
    const { video_id } = useParams()

    const [largevideo, setLargeVideo] = useState(null)
    const [comment, setComment] = useState(null)
    const [profile_pic_url, setProfilePicURL] = useState(null)
    const [username, setUsername] = useState(null)
    const [postComment, setPostComment] = useState(null)

    const handleLargeVideoRequest = async (user_id) => {
        const response = await axios.get(`http://localhost:8000/largevideo/${user_id}`)
        const video_array = response.data

        video_array.forEach((video) => {
          if (video.video_id == video_id) {
              setLargeVideo(video.source)

              video.comments.forEach((c) => {
                  setUsername(c.username)
                  setComment(c.comment)
              })


          } else {
              console.log('not the video youre looking for')
          }

        })


    }

    const handleCommentPost = async (e, user_id, video_id) => {
        e.preventDefault()
        try {
            if (comment) {
                const response = await axios.post(`http://localhost:8000/comment/${user_id}/${video_id}`, {username, comment})
                console.log(response.data)
                window.location.reload()
            }
        } catch (e) {
            console.log(e)
        }


    }



    useEffect(() => {
        handleLargeVideoRequest(user_id)
    },[video_id])




    return (
        <>  <div className="large-video-options-wrapper">

            <a href={`/user-page/${user_id}`}>
                <AiOutlineCloseCircle className="exit-button" />
            </a>
        </div>

        <div className="specific-video-background">
        <div className="large-video-background" >
            <video className="large-video"
                src={largevideo}>
            </video>
            <div className="large-video-wrapper">
            <div className="large-video-container">
                <video className="large-video-front"
                       src={largevideo}
                       controls={true}>
                </video>
            </div>

        </div>
            <div className="profile-comments-container">
                {comment ? (<Comment comment={comment} username={username}/>)
                :
                    (<p>
                        Be the first to comment
                    </p>)}

                < div className="comment-form-wrapper">
                    <form className="comment-form" onSubmit={event => handleCommentPost(user_id,video_id)}>
                        <input
                            type="text"
                            id ="comment"
                            onChange={event => setPostComment(event.target.value)}

                        />
                    </form>
                </div>
                <div className="comment-post-button-wrapper">
                    <button form="comment-form">
                        Post
                    </button>
                </div>
            </div>

        </div>
        </div>


        </>
    )
}

export default Largeuservideo