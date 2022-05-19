
import Videocard from "../components/js/videocard";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies, Cookies} from "react-cookie";
import Header from "../components/js/header";
import Sidebar from "../components/js/sidebar";



const Feed = () => {





    return (
                <>
                   <Header/>
                    <Sidebar/>
                    <Videocard/>



                </>

    )
}

export default Feed