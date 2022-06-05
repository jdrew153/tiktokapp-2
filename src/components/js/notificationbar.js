
const Notificationbar = ({ userAvatar, username, date, IsAcknowledged, notificationType, videoNotificationSource, comment }) => {
    return(
        <>
        {(IsAcknowledged === false) ? (
    <div className="notification-bar-wrapper-not-acknowledged">
        <div className="profile-picture">
            <img className="profile-picture-notification" src={userAvatar}/>
        </div>
        <div className="specific-notification-wrapper">
            <div className="notification-username-container">
                {username}
            </div>
            <div className="type-notification-wrapper">
                {(notificationType === "followed notification") ? (
                    <div className="other-dummy-div">
                        <p className="notification-text">
                            started following you
                        </p>
                        <p className="notification-text">
                            {date}
                        </p>
                    </div>
                    ) : (<> { (notificationType === "commented notification") ? ( <> <div className="other-dummy-div">
                        <p className="notification-text">
                            commented: {comment} on your video
                        </p>
                        <p className="notification-text">
                            {date}
                        </p>
                    </div> <div className="small-video-card"> <video className="small-video" src={videoNotificationSource}>
                    </video> </div> </>) :
                    ( <> <div className="other-dummy-div">
                        <p className="notification-text">
                            liked your video
                        </p>
                        <p className="notification-text">
                            {date}
                        </p>
                    </div> <div className="small-video-card"> <video className="small-video" src={videoNotificationSource}>
                    </video> </div> </>)}</>)
                }
            </div>

        </div>

    </div> ) : (<div className="notification-bar-wrapper">
            <div className="profile-picture">
                <img className="profile-picture-notification" src={userAvatar}/>
            </div>
            <div className="specific-notification-wrapper">
                <div className="notification-username-container">
                    {username}
                </div>
                <div className="type-notification-wrapper">
                    {(notificationType === "followed notification") ? (
                        <div className="other-dummy-div">
                            <p className="notification-text">
                                started following you
                            </p>
                            <p className="notification-text">
                                {date}
                            </p>
                        </div>) : (<> { (notificationType === "commented notification") ? ( <> <div className="other-dummy-div">
                            <p className="notification-text">
                                commented {comment} on your video
                            </p>
                            <p className="notification-text">
                                {date}
                            </p>
                        </div> <div className="small-video-card"> <video className="small-video" src={videoNotificationSource}>
                        </video> </div> </>) :
                        ( <> <div className="other-dummy-div">
                        <p className="notification-text">
                            liked your video
                        </p>
                        <p className="notification-text">
                            {date}
                        </p>
                    </div> <div className="small-video-card"> <video className="small-video" src={videoNotificationSource}>
                    </video> </div> </>)}</>)
                    }
                </div>


            </div>

        </div>)}
        </>
    )
}

export default Notificationbar