import { BrowserRouter, Routes ,Route } from "react-router-dom"
import Home from '../src/pages/home'
import Feed from '../src/pages/feed'
import Createaccount from "./pages/createaccount";
import Login from "./pages/login";
import Userprofilepage from "./pages/userprofilepage";
import './App.css';
import Largeuservideo from "./pages/largeuservideo";
import Followeduservideos from "./pages/followeduservideos";
import Uploadvideo from "./pages/uploadvideo";
import Messaging from "./pages/messaging";
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'


const queryClient = new QueryClient()

function App() {
  return (
  <div className="app">


    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
      <Routes>
      <Route path={"/home"} element={<Home/>}/>
      <Route path={"/feed"} element={<Feed/>}/>
      <Route path={"/create-account"} element={<Createaccount/>}/>
      <Route path={"/login"} element={<Login/>}/>
      <Route path={"/user-page/:user_id"} element={<Userprofilepage/>}/>
      <Route path={"/:user_id/:video_id"} element={<Largeuservideo/>}/>
      <Route path={"/followed-user/:username"} element={<Followeduservideos/>}/>
      <Route path={"/upload-video/:user_id"} element ={<Uploadvideo/>}/>
        <Route path={"/messages/:username"} element={<Messaging/>}/>
    </Routes>

      </QueryClientProvider>
    </BrowserRouter>
  </div>
  );
}

export default App;
