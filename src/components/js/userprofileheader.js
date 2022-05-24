import "../styles/components.css"
import axios from "axios";
import {useCookies} from "react-cookie";
import {useParams} from "react-router-dom";



const Userprofileheader = (user) => {



    return (

        <div className="user-profile-header">
            <div className="user-profile-header-wrapper">
                <div className="user-header-content">
                    <img className="profile-picture-header" src={user.profile_picture} alt="loading"/>

                </div>
                <div className="user-profile-username">
                    <h2 className="header-username">
                        {user.username}
                    </h2>
                    <h2 className="header-profile-description">
                        {user.profile_description}
                    </h2>


                </div>
        </div>
            <div className="followers-options-container">
                <div className="user-following-container">
                        <strong className="followers-options">
                            {user.followed}
                        </strong>
                    <span className="followers-text">
                        Following
                    </span>
                </div>
                <div className="user-following-container">
                    <strong className="followers-options">
                        {user.followers}
                    </strong>
                    <span className="followers-text">
                        Followers
                    </span>
                </div>
                <div className="user-following-container">
                    <strong className="followers-options">
                        {user.likes}
                    </strong>
                    <span className="followers-text">
                        Likes
                    </span>
                </div>
            </div>
            <div className="user-profile-signature">
                <h2 className="signature-text">
                    I like Harry not Josh
                </h2>
            </div>

        </div>
    )
}

export default Userprofileheader