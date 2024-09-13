import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import UploadLicensePage from "../pages/Driver/UploadLicense/UploadLicensePage"
import DriverProfile from "../pages/Driver/Driver Profile/DriverProfile"
import CreateRidePage from "../pages/Driver/CreateRide/CreateRide_2"
import RidesListPage from "../pages/Driver/MyRides/RidesList"
import RideDetailedViewDriver from "../components/driver/RideDetails/RideDetailsComponent2"

export default function DriverRoutes(){

    return(
        <Routes>
            <Route  path="/" element={<Home />}/>
            <Route path= '/upload-license' element={<UploadLicensePage />} />
            <Route path="/driver-profile" element={<DriverProfile />} />
            <Route path="/create-ride" element={<CreateRidePage />} />
            <Route path="/myrides" element={<RidesListPage />} />
            <Route path="/rideDetails/:rideId" element={<RideDetailedViewDriver />} />
        </Routes>
    )
}