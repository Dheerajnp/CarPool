import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import DocumentUploadPage from "../pages/User/DocumentUpload/DocumentUploadPage";
import UserProfile from "../pages/User/User Profile/UserProfile";
import SearchResultsPage from "../pages/User/RideSearch/SearchResultsPage";
import RideDetailsPage from "../pages/User/RideSearch/RideDetailsPage";
import UserRideListPage from "../pages/User/My Rides/UserRideListPage";
import UserRideDeatiledViewPage from "../pages/User/My Rides/UserRideDeatiledViewPage";


export default function UserRoutes(){

  return(
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/upload-document' element={<DocumentUploadPage />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/ride-details/:rideId" element={<RideDetailsPage />}/>
        <Route path="/myrides" element={<UserRideListPage/>}/>
        <Route path="/rideDetails/:rideId" element={<UserRideDeatiledViewPage/>}/>
    </Routes>
  )
}