


const Comment = ({ profile_pic_url, username, comment, time }) => {
    return (
        <div className="main-comment-container">
            <img  className="profile-picture" src={profile_pic_url} alt="loading"/>
            <div className="comment-username-wrapper">
            <h3 className="comment-option">
                {username}
            </h3>
            <p className="comment-option">
                {comment}
            </p>
                <p className="comment-option">
                    {time}
                </p>

        </div>


        </div>
    )
}

export default Comment