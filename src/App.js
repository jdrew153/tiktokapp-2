import { BrowserRouter, Routes ,Route } from "react-router-dom"
import Home from '../src/pages/home'
import Feed from '../src/pages/feed'
import Createaccount from "./pages/createaccount";
import Login from "./pages/login";
import Userprofilepage from "./pages/userprofilepage";
import './App.css';
import Largeuservideo from "./pages/largeuservideo";

function App() {
  return (
    <BrowserRouter>
    <Routes>

      <Route path={"/home"} element={<Home/>}/>
        <Route path={"/feed"} element={<Feed/>}/>
      <Route path={"/create-account"} element={<Createaccount/>}/>
      <Route path={"/login"} element={<Login/>}/>
      <Route path={"/user-page/:user_id"} element={<Userprofilepage/>}/>
      <Route path={"/:user_id/:video_id"} element={<Largeuservideo/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
