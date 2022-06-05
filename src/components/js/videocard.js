import "../../App.css"
import { AiFillHeart } from "react-icons/ai"
import { BsChatDotsFill} from "react-icons/bs"
import { FiPlay } from "react-icons/fi"
import axios from "axios";
import { useEffect, useState} from "react";
import {useRef} from "react";
import {useQueryClient ,useMutation, useQuery} from "react-query";


const Videocard = ({ profile_pic_url, profile_description, video, username, user_id, video_id, postusername, numLikes, likedusername, usersLikedVids, comments, views }) => {
    const queryClient = useQueryClient()
    const [liked, setLiked] = useState(false)


    //experimental views calculation
    const [initialTime, setInitialTime] = useState(Date)
    const [finalTime, setFinalTime] = useState(Date)
    const [videoDuration, setVideoDuration] = useState()
    const [hasLoaded, SetHasLoaded] = useState(false)
    const [watchTime, setWatchTime] = useState(0)
    const [updateViewCount, setUpdateViewCount] = useState(false)





    const handleLike = async (postusername, video_id, likedusername) => {
        try {
            const response = await axios.put(`http://localhost:8000/like/${postusername}/${video_id}/${likedusername}`)
            setLiked(true)
            return response


        } catch (error) {
            console.log(error)
        }

    }

    const handleUnlike = async (postusername, video_id, likedusername) => {
        try {
            const response = await axios.put(`http://localhost:8000/unlike/${postusername}/${video_id}/${likedusername}`)
            setLiked(false)

        } catch (error) {
            console.log(error)
        }
    }

    const handleIsInLikedArray = async (postusername, video_id) => {
        console.log('hit liked array')
        try {
            const response = await axios.get(`http://localhost:8000/liked-videos/${postusername}`)
            // if (response.data.find(video => video_id === video)) {
            //     setLiked(true)
            //
            // }
            return response.data

        } catch (error) {
            console.log(error)
            return false
        }
    }
    const videoRef = useRef(null)

    const getVidDuration = () => {


        let selectedVideo = videoRef.current

        if (hasLoaded === true ) {
            setVideoDuration(selectedVideo.duration)
            console.log(hasLoaded)
        } else {
            console.log(hasLoaded)
        }
        SetHasLoaded(false)
    }
    const {data, isLoading} = useQuery(['getting-liked-videos', postusername, video_id ], () => handleIsInLikedArray(postusername, video_id))
    console.log(data)

    useEffect(() => {
        handleIsInLikedArray(postusername, video_id)
    }, [numLikes])


    useEffect(() => {
        getVidDuration()
    }, [hasLoaded])

    let time = new Date()

    const handleInitialTime = (time) => {

        setInitialTime(time)
        setFinalTime(Date)
        setWatchTime(0)

    }
    const handleFinalTime = (time) => {
        setFinalTime(time)

    }



    const handleUpdatingViewCount = async (likedusername, video_id) => {
        try {
            const response = await axios.put(`http://localhost:8000/increment-view-count/${likedusername}/${video_id}`)

        } catch (error) {
            console.log(error)
        }
    }
 const testFunc = (time) => {

     handleFinalTime(time)

     if (finalTime > initialTime) {
         let ms = Math.abs(finalTime - initialTime)
         setWatchTime(ms / 1000)
         console.log('reloaded the page')
     }

     if (watchTime > 0.2) {
         setUpdateViewCount(true)
     } else {
         setUpdateViewCount(false)
     }


     handleUpdatingViewCount(likedusername, video_id)
     console.log('updated view count')
     setWatchTime(0)

 }
 const testUnlike = useMutation(({ postusername, video_id, likedusername }) => handleUnlike(postusername, video_id, likedusername), {
     onMutate: async newLikes => {
        await queryClient.cancelQueries(['getting-liked-videos',postusername, video_id])

         const previousData = queryClient.getQueryData(['getting-liked-videos',postusername, video_id])

         queryClient.setQueryData(['getting-liked-videos',postusername, video_id], [{
             postusername: postusername,
             video_id: video_id
         }])
         console.log(newLikes)
         return newLikes, previousData

     }, onSettled: newLikes => {
         queryClient.invalidateQueries(['getting-liked-videos',postusername, video_id])
     }

 })

 const testLike = useMutation(({ postusername, video_id, likedusername }) => handleLike(postusername, video_id, likedusername),
     {onMutate: async newLikes => {
        await queryClient.cancelQueries(['getting-liked-videos',postusername, video_id])

        const previousData = queryClient.getQueryData(['getting-liked-videos',postusername, video_id])

        queryClient.setQueryData(['getting-liked-videos',postusername, video_id], [{
            postusername: postusername,
            video_id: video_id
        }])
        console.log(newLikes)
        return newLikes, previousData

    }, onSettled: newLikes => {
             queryClient.invalidateQueries(['getting-liked-videos',postusername, video_id])
         }

})








    return (
       <>
           {video_id && usersLikedVids && (!(videoDuration === null)) &&

               <div className="main-video-container">
                   <div className="profile-picture-spacer-video">
                       <img className="video-profile-picture" src={profile_pic_url} alt="loading"
                       />
                   </div>
                   <div className="actual-video-container"
                   >
                       <div className="video-tags-container">
                           <a href={`/user-page/${user_id}`}>
                               <h3 className="username-container">
                                   {username}
                               </h3>
                               <div className="tag-container">
                                   <p className="tags">
                                       {profile_description}
                                   </p>
                               </div>
                           </a>
                           <div className="video-likes-container"
                           >
                               <div className="dummy-time-tracking-div"
                                    onMouseOver={event => handleInitialTime(time)}
                                    onMouseOut={event => testFunc(time)}
                               >
                                   <video className="main-video"
                                           muted={true}
                                           controls={false}
                                           onMouseOver={event => {event.target.play()}}
                                           onMouseOut={event => {event.target.pause()}}
                                           src={video}
                                           ref={videoRef}
                                           onLoadedMetadata={event => SetHasLoaded(true)}
                                   />

                               </div>



                               <div className="specific-video-options-wrapper">
                                   <div className="likes-container">

                                       {((usersLikedVids.find(video => video.video_id === video_id))) ? (<AiFillHeart className="icon-likes-red"
                                                                                                           onClick={event => handleUnlike(postusername,video_id,likedusername)}/>) : (
                                           <AiFillHeart className="icon-likes"
                                                        onClick={event => handleLike(postusername,video_id,likedusername)}/>)}
                                       <p className="number-comments-text">
                                           {numLikes}
                                       </p>
                                       <div className="comments-container">
                                           <a href={`/${user_id}/${video_id}`}>
                                               <BsChatDotsFill className="icon-comment"></BsChatDotsFill>
                                               <p>
                                                   {comments}
                                               </p>
                                           </a>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           }

       </>
    )
}
export default Videocard