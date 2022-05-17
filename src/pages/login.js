import Authmodal from "../components/authmodal";


const Login = () => {
    return (
        <>
        <div className="auth-container">
            <div className="logo-text-container">
                <img className="auth-container-logo" src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/800px-TikTok_logo.svg.png" alt="please be patient, things are loading"/>
                <h3 className="logo-tag-name">
                    Come spend your day with us
                </h3>
            </div>
           <Authmodal/>
        </div>
        <div className="business-container">
            <p>
                Link
            </p>
        </div>
        </>
    )
}

export default Login