import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import DocumentUploadPage from "../pages/User/DocumentUpload/DocumentUploadPage";


export default function UserRoutes(){

  return(
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/upload-document' element={<DocumentUploadPage />} />
    </Routes>
  )
}