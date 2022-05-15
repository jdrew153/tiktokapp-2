import Authmodal from "../components/authmodal";
import {useCookies} from "react-cookie";
import {useEffect} from "react";

const Login = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)




    return (
        <>
        <div className="auth-container">
           <Authmodal/>
        </div>
        <div className="business-container">

        </div>
        </>
    )
}

export default Login