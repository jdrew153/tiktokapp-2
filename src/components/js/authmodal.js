import {useEffect, useState} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {useCookies, withCookies} from "react-cookie";

const Authmodal =  () => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [error, setError] = useState(null)
    const [pic, setPic] = useState(null)
    const [cookies, setCookie, removeCookie] =useCookies(null)

    let navigator = useNavigate()

    useEffect(() => {
        removeCookie('username')
    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.get(`http://localhost:8000/specific_user${email}`)

            if (response.status === 201) {
                setisLoggedIn(true)
                setCookie('username',email, {path: "/"})

                setCookie('profile_picture', response.data.profile_pic_url, {path: "/"} )
                navigator('/feed')

            } else {
                setError("account not found, try again or create an account")
            }
            window.location.reload()

        } catch (error) {
            setError(error)
            console.log(error)
        }
    }
    const handleClick = () => {
        navigator('/create-account')
        window.location.reload()
    }
    return (
        <>
        <div className="main-auth-modal-container">
            <div className="input-container">
                <form id="email-input-form" onSubmit={handleSubmit}>
                    <input
                    className="email-input"
                    placeholder="Email or Username"
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="password-input"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </form>
               <button className="form-button" form="email-input-form">
                   Log in
               </button>
                <div className="forgotten-password-link-container">
                <a className="forgotten-password-link" href="https://tiktok.com">
                    Forgot Password?
                </a>
                </div>
                <div className="create-account-button-container">
                <button className="create-account-button" onClick={handleClick} >
                    Create Account
                </button>
                </div>
            </div>
        </div>
        </>
    )
}

const AuthmodalCookies = withCookies(Authmodal)


export default AuthmodalCookies