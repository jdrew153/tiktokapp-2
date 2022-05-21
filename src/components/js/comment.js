
const Comment = ({ profile_pic_url, username, comment }) => {
    return (
        <div className="main-comment-container">
            <img src={profile_pic_url} alt="loading"/>
            <div className="comment-username-wrapper">
            <h3>
                {username}
            </h3>
            <p>
                {comment}
            </p>
        </div>

        </div>
    )
}

export default Comment