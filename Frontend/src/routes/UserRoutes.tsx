import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import DocumentUploadPage from "../pages/User/DocumentUpload/DocumentUploadPage";
import UserProfile from "../pages/User/DocumentUpload/User Profile/UserProfile";


export default function UserRoutes(){

  return(
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/upload-document' element={<DocumentUploadPage />} />
        <Route path="/user-profile" element={<UserProfile />} />
    </Routes>
  )
}