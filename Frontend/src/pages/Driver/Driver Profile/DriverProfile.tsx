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

const DriverProfile: React.FC = () => {
  const { auth } = useEssentials();
  const [driver, setDriver] = useState<Driver>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const driverId = auth.user?.email;
  const data = { driverId };

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
  }, [driverId]);

  const [profilePicture, setProfilePicture] = useState<string>(
    "/placeholder-user.jpg"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingDriverInfo, setIsEditingDriverInfo] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState<Vehicle | null>(
    null
  );
  const [isEditingLicenseInfo, setIsEditingLicenseInfo] = useState(false);

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
    let d = driver;
    d?.vehicles?.push(updatedVehicle);
    setDriver(d);
    setIsEditingVehicle(null);
    console.log(driver)
  };

  const handleSaveLicenseInfo = (updatedDriver: Driver) => {
    setDriver(updatedDriver);
    setIsEditingLicenseInfo(false);
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
        <div className="grid gap-8 md:grid-cols-2 border  rounded-md  dark:shadow-indigo-500  dark:bg-slate-900 dark:text-white p-5">
          <div className="bg-background rounded-lg shadow-sm p-6 space-y-6  col-span-2 dark:bg-slate-800">
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
              {/* <div className="flex items-center gap-2">
                <LocateIcon className="h-5 w-5 text-muted-foreground" />
                <span>{driver.address || "NA"}</span>
              </div> */}
            </div>
          </div>
          <div className="col-span-2  bg-background rounded-lg shadow-sm p-6 space-y-6 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold text-lg">Driver's License</div>
                <div className="text-muted-foreground">
                  License Number: {driver.licenseStatus}
                </div>
                <div className="text-muted-foreground">
                  Expiration Date: {driver.blocked || "achvchs"}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-col sm:flex-row">
                {driver.licenseFrontUrl ? (
                  <img
                    src={driver.licenseFrontUrl}
                    width={110}
                    height={110}
                    alt="License Front"
                    className="rounded-md h-full"
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
                    className="rounded-md h-full"
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
                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <div className="font-semibold">{vehicle.brand} {vehicle.model}</div>
                        <div className="text-muted-foreground">
                          License Plate: {vehicle.brand}
                        </div>
                        {vehicle.rcDocumentUrl ? (
                          <img
                            src={imgPlaceholder}
                            width={80}
                            height={80}
                            alt="Registration Certificate"
                            className="rounded-md"
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
