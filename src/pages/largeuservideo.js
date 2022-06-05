import axios from "axios";
import {useParams} from "react-router-dom";
import {useState,useEffect} from "react";
import {AiOutlineCloseCircle, AiOutlineEllipsis, AiOutlineHeart} from 'react-icons/ai'
import Comment from "../components/js/comment";
import {useCookies} from "react-cookie";
import Specificvideoheader from "../components/js/specificvideoheader";


const Largeuservideo = () => {
    const { user_id } = useParams()
    const { video_id } = useParams()


    const [largevideo, setLargeVideo] = useState(null)
    const [comment, setComment] = useState(null)
    const [postComment, setPostComment] = useState(null)
    const [firstComment, setFirstcomment] = useState(null)
    const [commentPosted, setCommentPosted] = useState(false)
    const [cookies, setCookies, removeCookies] = useCookies()
    const [likes, setLikes] = useState(null)

    const [username, setUsername] = useState(null)
    const [profile_picture_url, setProfile_Picture_URL] = useState(null)

    const [totalComms, setTotalComms] = useState(null)
    const [deletedComment, setDeletedComment] = useState(false)




    const postUsername = cookies.username
    const profile_pic = cookies.profile_picture

    const handleLargeVideoRequest = async (user_id) => {
        const response = await axios.get(`http://localhost:8000/user_videos/${user_id}`)

        setUsername(response.data.username)
        setProfile_Picture_URL(response.data.profile_pic_url)

        const video_array = response.data.videos

        video_array.forEach((video) => {
          if (video.video_id == video_id) {
              setLargeVideo(video.source)
              setLikes(video.likes)
          } else {
              console.log('not the video youre looking for')
          }
        })
    }

    const handleCommentPost = async (user_id, video_id) => {
        console.log('posting a comment')
        setCommentPosted(false)
        try {
            if (comment) {
                const response = await axios.put(`http://localhost:8000/comment/${user_id}/${video_id}`, {postUsername, postComment, profile_pic})
                console.log(response.data)
                setCommentPosted(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetComment = async (video_id) => {
        console.log('getting comments')
        try {
            const response = await axios.get(`http://localhost:8000/retrievecomment/${video_id}`)
            const data = response.data
            setComment(data.comments)
            setTotalComms(data.comments.length)
        } catch (e) {
            console.log(e)
        }
    }

    const handlePostFirstComment = async (video_id) => {

        console.log('test')
        try {
            const response = await axios.put(`http://localhost:8000/writecomment/${video_id}`, {postUsername, firstComment,profile_pic})
            console.log(response.data)
            setCommentPosted(true)

        } catch (error) {
            console.log(error)
        }
    }

     const handleDeleteComment = async (video_id, comment_id, user_id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/deletecomment/${video_id}/${comment_id}/${user_id}`, {data: {comment_id: comment_id}})
            console.log(response.data)
            setDeletedComment(true)

        } catch (error) {
            console.log(error)
        }
     }

     const handleLikeComment = async (video_id, comment_id) => {
        try {
            const response = await axios.put(`http://localhost:8000/like_comment/${video_id}/${comment_id}`)

        } catch (error) {
            console.log(error)

        }
     }


    useEffect(() => {
        handleLargeVideoRequest(user_id)
    }, [postUsername])

    useEffect(()=> {
        handleGetComment(video_id)
    }, [comment, deletedComment])



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

                     <> <Specificvideoheader profile_pic={profile_picture_url} username={username} numComments={totalComms} numLikes={likes} />
               </>
                {comment? (
                <div className="comment-wrapper">

                    {comment?.map((i) => (
                        <>
                        <div className="icon-alignment-container">
                            <Comment comment={i?.comment}
                                     username={i?.username}
                                     profile_pic_url={i?.profile_pic}
                                     time={i?.time_stamp}
                            />
                            <div className="comment-options-container">
                                <AiOutlineEllipsis className="comment-options-icon-delete" onClick={event => handleDeleteComment(video_id, i.comment_id, user_id)}/>
                                <AiOutlineHeart className="comment-options-icon" onClick={event => handleLikeComment(video_id, i.comment_id)}/>
                                <p className="num-likes">
                                    {i.likes}
                                </p>
                            </div>
                        </div>

                        </>

                    ))}


                    < div className="comment-form-wrapper">
                        <form className="comment-form" onSubmit={event => handleCommentPost(user_id,video_id)}>
                            <input
                                type="text"
                                id ="comment"
                                placeholder="Add a comment..."
                                onChange={event => setPostComment(event.target.value)}

                            />
                        </form>
                    </div>
                    <div className="comment-post-button-wrapper" onClick={event => handleCommentPost(user_id,video_id)}>

                    </div>

                </div>) : (<> <div>
                    Be the first to comment
                </div>

                    < div className="comment-form-wrapper">
                        <form className="comment-form-first" onSubmit={event => handlePostFirstComment(video_id)}>
                            <input
                                type="text"
                                id ="firstcomment"
                                placeholder="Be the first comment...."
                                onChange={event => setFirstcomment(event.target.value)}

                            />
                        </form>
                    </div>
                    <div className="comment-post-button-wrapper">

                    </div>

                </>)}



            </div>

        </div>
        </div>


        </>
    )
}

export default Largeuservideo