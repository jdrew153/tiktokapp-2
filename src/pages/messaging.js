import Header from "../components/js/header";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useState, useEffect} from "react";
import {BsPencilSquare} from "react-icons/bs";
import {AiOutlineCloseCircle} from "react-icons/ai"


const Messaging = () => {
    const [cookies, setCookies, RemoveCookies] = useCookies()
    const [selectedUserData, setSelectedUserData] = useState(null)
    const [allMessages, setAllMessages] = useState(null)
    const [specificUser, setSpecificUser] = useState(null)
    const [dataLoaded, setDataisLoaded] = useState(false)
    const [message, setMessage] = useState(null)
    const [sentMessage, setSentMessage] = useState(0)
    const username = cookies.username
    const profile_pic_url = cookies.profile_picture

    const [followedUsers, setFollowedUsers] =  useState(null)
    const [showFollowedUsers, setShowFollowedUsers] = useState(false)
    const [searchTerm, setSearchTerm] = useState(null)
    const [sendNewMessage, setSendNewMessage] = useState(false)
    const [selectedUserToMessage, setSelectedUserToMessage] = useState(null)
    const [selectedUserToMessageProfilePic, setSelectedUserToMessageProfilePic] = useState(null)



    const getUsersMessages = async (username) => {
        const response = await axios.get(`http://localhost:8000/get-messages/${username}`)
        const messageData = response.data

        setAllMessages(messageData)

    }


    // const {data, isFetched, isError} = useQuery(['get-messages',username], ()=> getUsersMessages(username))


    const getSpecificMessages = async (username, sender_username) => {
        try {
            const response = await axios.get(`http://localhost:8000/specific-sent-user-messages/${username}/${sender_username}`)
            setSelectedUserData(response.data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleSendMessage = async (username, senderusername) => {

        try {
            const response = await axios.put(`http://localhost:8000/send-a-message/${username}/${senderusername}`, {profile_pic_url, message})
            setSentMessage(sentMessage +1)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSendANewMessage = async (username, senderusername) => {

        try {
            const response = await axios.put(`http://localhost:8000/send-a-message/${username}/${senderusername}`, {profile_pic_url, message, selectedUserToMessageProfilePic})
            setSentMessage(sentMessage +1)
            setSendNewMessage(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetFollowers = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8000/get-all-followers/${username}`)
            setFollowedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleSendingANewMessage = (sender_username, user_profile_pic_url) => {
        setSendNewMessage(true)
        setSelectedUserToMessage(sender_username)
        setSelectedUserToMessageProfilePic(user_profile_pic_url)

    }




    useEffect(() => {
        getUsersMessages(username)
        handleGetFollowers(username)
    }, [sentMessage])

    console.log(selectedUserData)



    return (
        <>
            <Header/>
            <div className="messaging-container">

                <div className="sender-messaging-modal">
                    <>
                        <div className="messaging-header-container">
                            <h3>
                                Messages
                            </h3>
                            <div className="new-messages-icon-container">
                                <BsPencilSquare className="new-messages-icon" onClick={event => setShowFollowedUsers(true)}/>
                            </div>

                            {(showFollowedUsers) ? (
                                <>
                                <div className="followed-users-modal-container">
                                    <div className="followed-users-modal-header">
                                        <h3 className="followed-users-modal-header">
                                            Find a user to message
                                        </h3>
                                    </div>
                                    {followedUsers && followedUsers.map((x) =>
                                            <div className="followed-user-modal-bar" onClick={event => handleSendingANewMessage(x.username, x.profile_pic_url)}>
                                                <img className="smaller-profile-picture" src={x.profile_pic_url} alt="loading"/>
                                                <div className="followed-user-modal-bar-username-wrapper"  onClick={event => setShowFollowedUsers(false)}>
                                                <h3>
                                                    {x.username}
                                                </h3>
                                                    <p>
                                                        @{x.username}
                                                    </p>
                                                </div>
                                            </div>

                                        )}
                                </div>
                                </>
                            ): (<div> </div>)

                            }

                            {(sendNewMessage === true) ? (
                                <>
                                <div className="new-message-background-overlay">
                                </div>
                                <div className="new-message-container">
                                    <AiOutlineCloseCircle className="close-out" onClick={event => setSendNewMessage(false)}/>
                                    <div className="messaging-input-wrapper">
                                        <form id="messaging-input-form" onSubmit={event => handleSendANewMessage(username, selectedUserToMessage)}>
                                            <input
                                                id="message"
                                                placeholder="type a message"
                                                type="text"
                                                onChange={event => setMessage(event.target.value)}
                                            />
                                        </form>
                                    </div>

                                </div>
                                </>
                            ) : (<div> </div>)

                            }

                        </div>
                            <div className="singular-user-message-container">
                                { allMessages && allMessages.conversations.map((i) =>
                                    <>
                                    {( selectedUserData && selectedUserData[0].sender_username === i.sender_username) ?  (
                                        <div className="singular-user-message-container-wrapper-selected"  onClick={event => getSpecificMessages(username, i.sender_username)}>
                                        <img className="messaging-profile-picture" src={i.profile_pic_url} alt="loading">
                                        </img>
                                        <div className="user-messages-options">

                                            <h3 className="user-messages-options-username">
                                                {i.sender_username}
                                            </h3>
                                            <p className="user-messages-options-type">
                                                Shared a message with you
                                            </p>

                                        </div>
                                        </div>) : ( <div className="singular-user-message-container-wrapper"  onClick={event => getSpecificMessages(username, i.sender_username)}>
                                        <img className="messaging-profile-picture" src={i.profile_pic_url} alt="loading">
                                        </img>
                                        <div className="user-messages-options">
                                            <h3 className="user-messages-options-username">
                                                {i.sender_username}
                                            </h3>
                                            <p className="user-messages-options-type">
                                                Shared a message with you
                                            </p>

                                        </div>
                                    </div>)
                                    }
                                    </>
                                )}
                            </div>

                    </>
                </div>
                <>
                <div className="messages-modal" onClick={event => setShowFollowedUsers(false)}>
                    {selectedUserData && <div className="singular-user-message-header-wrapper">
                        <img src={selectedUserData[0].profile_pic_url} className="messaging-profile-picture"/>
                        <div className="user-messages-options">
                        <h3 className="specific-header-username">
                            {selectedUserData[0].sender_username}
                        </h3>
                        <p className="specific-header-username">
                           @{selectedUserData[0].sender_username}
                        </p>
                        </div>
                    </div>
                    }
                    <div className="messages-container">
                        {selectedUserData && selectedUserData[0].messages.map((x) =>
                            <>
                            <div className="message-time-container">
                                <p className="time-stamp">
                                    {x.time_stamp}
                                </p>
                            </div>
                            {(!(x.sender_username === username)) ?
                                (<div className="specific-user-message">
                                <img src={x.profile_pic_url} className="smaller-profile-picture"/>
                                <div className="actual-message-bubble">
                                    <p className="actual-message-text">
                                        {x.message}
                                    </p>
                                </div>

                                </div>) :(<div className="specific-user-message-receiving">

                                    <div className="actual-message-bubble">
                                        <p className="actual-message-text">
                                            {x.message}
                                        </p>
                                    </div>
                                    <img src={x.profile_pic_url} className="smaller-profile-picture"/>

                                </div>)}
                            </>

                        )

                        }
                    </div>

                    <div className="messaging-input-wrapper">
                        <form id="messaging-input-form" onSubmit={event => handleSendMessage(username, selectedUserData[0].sender_username)}>
                            <input
                                id="message"
                                placeholder="type a message"
                                type="text"
                                onChange={event => setMessage(event.target.value)}
                            />
                        </form>
                    </div>



                </div>
                </>
            </div>
        </>

    )
}
export default Messaging