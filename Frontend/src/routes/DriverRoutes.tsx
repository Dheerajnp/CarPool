import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import UploadLicensePage from "../pages/Driver/UploadLicense/UploadLicensePage"

export default function DriverRoutes(){

    return(
        <Routes>
            <Route  path="/" element={<Home />}/>
            <Route path= '/upload-license' element={<UploadLicensePage />} />
        </Routes>
    )
}