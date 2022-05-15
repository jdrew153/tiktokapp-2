import { BrowserRouter, Routes ,Route } from "react-router-dom"
import Home from '../src/pages/home'
import Feed from '../src/pages/feed'
import Createaccount from "./pages/createaccount";
import Login from "./pages/login";
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>

      <Route path={"/home"} element={<Home/>}/>
        <Route path={"/feed"} element={<Feed/>}/>
      <Route path={"/create-account"} element={<Createaccount/>}/>
      <Route path={"/login"} element={<Login/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
