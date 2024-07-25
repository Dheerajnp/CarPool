import React, { useState, useRef, useEffect } from "react";
import imgPlaceholder from "../../../assets/imgPlaceholder.png";
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useEssentials } from "../../../hooks/UseEssentials";
import { Driver, Vehicle } from "../../../redux/userStore/Authentication/interfaces";
import axios from "axios";
import EditDriverInfoModal from "./EditDriverInfoModal";
import EditVehicleModal from "./EditVehicleInfoModal";
import EditLicenseInfoModal from "./EditLicenseInfoModal";
import Header from "../../../components/Navbar";
import RoundLoader from "../../../components/RoundLoader";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import ImageModal from "./ImageModal";

const DriverProfile: React.FC = () => {
  const { auth } = useEssentials();
  const [driver, setDriver] = useState<Driver>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const driverId = auth.user?.email;
  const data = { driverId };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingDriverInfo, setIsEditingDriverInfo] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState<Vehicle | null>(
    null
  );
  const [isEditingLicenseInfo, setIsEditingLicenseInfo] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined); 
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); 
  useEffect(() => {
    const fetchDriver = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/driver/getDriver", {
          data,
          withCredentials: true,
        });
        setDriver(response.data.user);
      } catch (error) {
        setError("Failed to fetch driver details. Please try again later.");
        console.error("Error fetching driver:", error);
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchDriver();
    }
  }, [driverId,auth]);

  const [profilePicture, setProfilePicture] = useState<string>(
    "/placeholder-user.jpg"
  );
  

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDriverInfo = (updatedDriver: Driver) => {
    setDriver(updatedDriver);
    setIsEditingDriverInfo(false);
  };

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
    console.log("saving",updatedVehicle);
    setDriver((prevDriver:any) => {
      if (!prevDriver) return prevDriver;
      return {
        ...prevDriver,
        vehicles: [...(prevDriver.vehicles || []), updatedVehicle],
      };
    });
    
    setIsEditingVehicle(null);
  };
  
  const handleSaveLicenseInfo = (updatedDriver: Driver) => {
    setDriver(updatedDriver);
    setIsEditingLicenseInfo(false);
  };

  const handleVehicleDelete = async () => {
    if (!vehicleToDelete) return;
    setLoading(true);
 
    try {
      const response = await axios.put(`/driver/deleteVehicle/${vehicleToDelete}`,{driverId:driver?._id});
      if(response.data.status === 200){
        setDriver((prevDriver:any) => {
          if (!prevDriver) return prevDriver;
          return {
            ...prevDriver,
            vehicles: prevDriver.vehicles?.filter((vehicle:any) => vehicle._id !== vehicleToDelete),
          };
        });
        setIsDeleteConfirmationOpen(false);
        setVehicleToDelete(null);
        toast.success("Vehicle deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleOpenDeleteConfirmation = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setIsDeleteConfirmationOpen(true);
  };

  const handleImageClick = (imageUrl: string|undefined) => {
    console.log("Image clicked",imageUrl)
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RoundLoader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!driver) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dark:bg-gray-800">
      <Header />
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-12 ">
        <div className="grid gap-8 md:grid-cols-2 border rounded-md dark:shadow-indigo-500 dark:bg-slate-900 dark:text-white p-5">
          <div className="bg-background rounded-lg shadow-sm p-6 space-y-6 col-span-2 dark:bg-slate-800">
            <div className="flex items-center gap-4 dark:bg-slate-800">
              <label htmlFor="avatar-input">
                <Avatar className="h-16 w-16 cursor-pointer">
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleProfilePictureChange}
                />
              </label>
              <div className="flex items-center gap-2 dark:bg-slate-800">
                <div className="font-semibold text-lg">{driver.name}</div>
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  {driver.verified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
              <Button
                size="sm"
                className="ml-auto"
                onClick={() => setIsEditingDriverInfo(true)}
              >
                Edit
              </Button>
            </div>
            <div className="grid gap-2 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <MailIcon className="h-5 w-5 text-muted-foreground" />
                <span>{driverId}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                <span>{driver.phone || "NA"}</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-background rounded-lg shadow-sm p-6 space-y-6 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold text-lg">Driver's License</div>
                <div className="text-muted-foreground">
                  Status: {driver.licenseStatus}
                </div>
                {/* <div className="text-muted-foreground">
                  Expiration Date: {driver.blocked || "achvchs"}
                </div> */}
              </div>
              <div className="flex items-center gap-2 flex-col sm:flex-row">
                {driver.licenseFrontUrl ? (
                  <img
                    src={driver.licenseFrontUrl}
                    width={110}
                    height={110}
                    alt="License Front"
                    className="rounded-md h-full cursor-pointer"
                    onClick={() => handleImageClick(driver.licenseFrontUrl)}
                  />
                ) : (
                  <img
                    src={imgPlaceholder}
                    width={110}
                    height={110}
                    alt="License Front"
                    className="rounded-md h-full"
                  />
                )}
                {driver.licenseBackUrl ? (
                  <img
                    src={driver.licenseBackUrl}
                    width={110}
                    height={110}
                    alt="License Back"
                    className="rounded-md h-full cursor-pointer"
                    onClick={() => handleImageClick(driver.licenseBackUrl)}
                  />
                ) : (
                  <img
                    src={imgPlaceholder}
                    width={100}
                    height={100}
                    alt="License Back"
                    className="rounded-md h-full"
                  />
                )}
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setIsEditingLicenseInfo(true)}
            >
              Edit License Info
            </Button>
          </div>
          <div className="col-span-2 bg-background rounded-lg shadow-sm p-6 space-y-6 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-lg">Vehicles</div>
              <Button
                size="sm"
                onClick={() => setIsEditingVehicle({} as Vehicle)}
              >
                Add Vehicle
              </Button>
            </div>
            <div className="grid gap-4">
              {driver.vehicles &&
                driver.vehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className="bg-muted rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 justify-between">
                      <div className="space-y-1">
                        <div className="font-semibold">{vehicle.brand} {vehicle.model}</div>
                        <div className="text-muted-foreground">
                          License Plate: {vehicle.number}
                        </div>
                        <div className="text-muted-foreground">
                          Approval status : {vehicle.status}
                        </div>
                      </div>
                    </div>
                    <div className="">
                      {vehicle.rcDocumentUrl ? (
                          <img
                            src={vehicle.rcDocumentUrl}
                            width={80}
                            height={80}
                            alt="Registration Certificate"
                            className="rounded-md"
                            onClick={() => handleImageClick(vehicle.rcDocumentUrl)}
                          />
                        ) : (
                          <img
                            src={imgPlaceholder}
                            width={80}
                            height={80}
                            alt="Registration Certificate"
                            className="rounded-md"
                          />
                        )}
                      <div className="flex justify-end mt-5">
                        <a
                          className="mt-2 ml-8 text-black cursor-pointer"
                          onClick={() => handleOpenDeleteConfirmation(vehicle._id.toString())}
                        >
                          <MdDelete className="text-red-600 bg-gray-200 rounded-full size-10 p-2"/>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {isEditingDriverInfo && (
          <EditDriverInfoModal
            driver={driver}
            onClose={() => setIsEditingDriverInfo(false)}
            onSave={handleSaveDriverInfo}
          />
        )}
        {isEditingVehicle && (
          <EditVehicleModal
            driver={driver}
            vehicle={isEditingVehicle}
            onClose={() => setIsEditingVehicle(null)}
            onSave={handleSaveVehicle}
          />
        )}
        {isEditingLicenseInfo && (
          <EditLicenseInfoModal
            driver={driver}
            onClose={() => setIsEditingLicenseInfo(false)}
            onSave={handleSaveLicenseInfo}
          />
        )}
        {isDeleteConfirmationOpen && (
          <DeleteConfirmationModal
            isOpen={isDeleteConfirmationOpen}
            onClose={() => setIsDeleteConfirmationOpen(false)}
            onConfirm={handleVehicleDelete}
          />
        )}
        {selectedImageUrl && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={selectedImageUrl}
        />
      )}
      </div>
    </div>
  );
};

function MailIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default DriverProfile;
