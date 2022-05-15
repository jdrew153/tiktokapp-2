import { useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [username, setUserName] = useState("")
    const [profile_pic_url, setprofile_pic_url] = useState("")
    const [video, setVideo] = useState("")
    const [firstname, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [day, setDay] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [error, setError] =useState(null)
    const [loggedIn, seLoggedIn] = useState(false)

    let navigate = useNavigate()

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {
            if (!(password == confirmpassword) && (!('@' in email))) {
                setError("passwords don't match")
                console.log(error)
            } else {
                const response = await axios.post('http://localhost:8000/signup', { email, password, username, profile_pic_url, video})
                const success = response.status == 201
                seLoggedIn(true)
                console.log("success", response.data)
                if ((success)  &&  (seLoggedIn)) {
                    navigate ('/feed')

                }

                window.location.reload()
            }
        } catch(error) {
            console.log(error)
        }
    }
    return (
        <div className="sign-up-form">
            <img className="sign-up-form-background-image-1" src="https://ei.phncdn.com/videos/202111/18/398226241/original/(m=q489S5WbeaAaGwObaaaa)(mh=8vH3gXSfLrq4hrrl)0.jpg"/>

            <form id="sign-up-form" className="login-form" onSubmit={handleSubmit}>
                <h3>
                    Username
                </h3>
                <input
                    className="username-input"
                    placeholder="Username"
                    required={true}
                    onChange={(e) => setUserName(e.target.value)}/>
                <h3>
                    First and Last Name
                </h3>
                <input
                    className="first-name-input"
                    placeholder="First Name"
                    onChange={(e) =>setFirstName(e.target.value)}/>
                required={true}
                <input className="last-name-input" placeholder="Last Name"/>
                <h3>
                    Email
                </h3>
                <input
                    className="email-input"
                    placeholder="Email"
                    required={true}
                    onChange={(e) =>setEmail(e.target.value)}/>
                <h3>
                    Profile Picture
                </h3>
                    <input
                        className="profile-picture-input"
                        placeholder="type in pic url"
                        required={true}
                        onChange={(e) =>setprofile_pic_url(e.target.value)}/>
                <h3>
                    First Video
                </h3>
                <input
                    className="profile-picture-video"
                    placeholder="first video url"
                    required={true}
                    onChange={(e) => setVideo(e.target.value)}/>

                <h3>
                    Birthday
                </h3>
                <input
                    className="birthday-day-input"
                    placeholder="Day"
                    required={true}
                    onChange={(e) =>setDay(e.target.value)}/>
                <input
                    className="birthday-month-input"
                    placeholder="Month"
                    required={true}
                    onChange={(e) =>setMonth(e.target.value)} />
                <input
                    className="birthday-year-input"
                    placeholder="Year"
                    required={true}
                    onChange={(e) =>setYear(e.target.value)}/>
                <h3>
                    Password
                </h3>
                <input
                    className="password-input"
                    placeholder="Password"
                    required={true}
                    onChange={(e) =>setPassword(e.target.value)}
                />
                <h3>
                    Confirm Password
                </h3>
                <input
                    className="confirm-password-input"
                    placeholder="Confirm Password"
                    required={true}
                    onChange={(e) =>setConfirmPassword(e.target.value)}/>
                <button form="sign-up-form" className="submit-form-button"  >
                    Submit Your Profile
                </button>


            </form>
        </div>
    )
}

export default Login
