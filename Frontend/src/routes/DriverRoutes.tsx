import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import UploadLicensePage from "../pages/Driver/UploadLicense/UploadLicensePage"
import DriverProfile from "../pages/Driver/Driver Profile/DriverProfile"
import CreateRidePage from "../pages/Driver/CreateRide/CreateRide_2"

export default function DriverRoutes(){

    return(
        <Routes>
            <Route  path="/" element={<Home />}/>
            <Route path= '/upload-license' element={<UploadLicensePage />} />
            <Route path="/driver-profile" element={<DriverProfile />} />
            <Route path="/create-ride" element={<CreateRidePage />} />
        </Routes>
    )
}