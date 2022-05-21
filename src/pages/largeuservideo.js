import axios from "axios";
import {useParams} from "react-router-dom";
import {useState,useEffect} from "react";
import {AiOutlineCloseCircle} from 'react-icons/ai'
import Comment from "../components/js/comment";
import {useCookies} from "react-cookie";


const Largeuservideo = () => {
    const { user_id } = useParams()
    const { video_id } = useParams()


    const [largevideo, setLargeVideo] = useState(null)
    const [comment, setComment] = useState(null)
    const [profile_pic_url, setProfilePicURL] = useState(null)
    const [postComment, setPostComment] = useState(null)
    const [firstComment, setFirstcomment] = useState(null)
    const [commentPosted, setCommentPosted] = useState(false)
    const [cookies, setCookies, removeCookies] = useCookies()

    const postUsername = cookies.username

    const handleLargeVideoRequest = async (user_id) => {
        const response = await axios.get(`http://localhost:8000/largevideo/${user_id}`)
        const video_array = response.data

        video_array.forEach((video) => {
          if (video.video_id == video_id) {
              setLargeVideo(video.source)
          } else {
              console.log('not the video youre looking for')
          }
        })
    }

    const handleCommentPost = async (e, user_id, video_id) => {
        console.log('hit')
        setCommentPosted(false)
        try {
            if (comment) {
                const response = await axios.put(`http://localhost:8000/comment/${user_id}/${video_id}`, {postUsername, postComment})
                console.log(response.data)
                setCommentPosted(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetComment = async (video_id) => {
        console.log('otherhit')
        try {
            const response = await axios.get(`http://localhost:8000/retrievecomment/${video_id}`)
            const data = response.data
            setComment(data.comments)
        } catch (e) {
            console.log(e)
        }
    }

    const handlePostFirstComment = async (video_id) => {

        console.log('test')
        try {
            const response = await axios.put(`http://localhost:8000/writecomment/${video_id}`, {postUsername, firstComment})
            console.log(response.data)
            setCommentPosted(true)

        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        handleLargeVideoRequest(user_id)
    }, [video_id])

    useEffect(()=> {
        handleGetComment(video_id)
    }, [commentPosted])




    return (
        <>  <div className="large-video-options-wrapper">

            <a href={`/user-page/${user_id}`} >
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
                {comment? (
                <div className="comment-wrapper">
                    {comment?.map((i) => (
                        <Comment comment={i?.comment} username={i?.username}/>
                    ))}

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

                </div>) : (<> <div>
                    Be the first to comment
                </div>

                    < div className="comment-form-wrapper">
                        <form className="comment-form-first" onSubmit={event => handlePostFirstComment(video_id)}>
                            <input
                                type="text"
                                id ="firstcomment"
                                onChange={event => setFirstcomment(event.target.value)}

                            />
                        </form>
                    </div>
                    <div className="comment-post-button-wrapper">
                        <button form="comment-form" onClick={event => handlePostFirstComment(video_id)}>
                            Post
                        </button>
                    </div>

                </>)}



            </div>

        </div>
        </div>


        </>
    )
}

export default Largeuservideo