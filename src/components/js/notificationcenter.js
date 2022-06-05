import {useCookies} from "react-cookie";
import axios from "axios";
import {useEffect, useState} from "react";
import Notificationbar from "./notificationbar";

const NotificationCenter = () => {
    const [cookies, setCookies, RemoveCookies] = useCookies()
    const [notificationsArray, setNotificationsArray] = useState([])
    const [acknowledged, setAcknowledged] = useState(false)

    const username = cookies.username

    const handleGetNotifications = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8000/specific_user${username}`)
            const reversedNotificationArray = response.data.notifications.reverse()
            setNotificationsArray(reversedNotificationArray)
        } catch (error) {
            console.log(error)
        }

    }
    const handleAcknowledge = async (username, notification_id) => {
        try {
            const response = await axios.put(`http://localhost:8000/acknowledgeNotification/${username}/${notification_id}`)
            setAcknowledged(true)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetNotifications(username)
    }, [acknowledged])
    console.log(notificationsArray)

    return (
        <div className="main-notification-modal">
            <div className="notification-modal-header-wrapper">
                <h3 className="notification-modal-header" >
                    Notifications
                </h3>
            </div>
            <div className="notification-type-container">
                <span className="all-comments">
                    All
                </span>
            </div>
            <div className="notification-bar">
                {notificationsArray && notificationsArray.map((i) =>
                    <div className="dummy-div" onClick={event => handleAcknowledge(username, i.notification_id)}>

                    <Notificationbar userAvatar={i.avatar}
                                     username={i.username}
                                     date={i.time_stamp}
                                     IsAcknowledged={i.acknowledged}
                                     notificationType={i.type}
                                     videoNotificationSource={i.liked_video_source}
                                     comment={i.comment}
                    />
                    </div>
                )}
            </div>



        </div>


    )
}

export default NotificationCenter