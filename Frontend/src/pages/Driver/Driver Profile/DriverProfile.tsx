import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ModeToggle } from "../../../components/mode-toggle";
import axiosApiGateway from "../../../functions/axios";
import { useEssentials } from "../../../hooks/UseEssentials";
import { Driver, Vehicle } from "../../../redux/userStore/Authentication/interfaces"; // Update with correct paths/interfaces
import axios from "axios";
import EditDriverInfoModal from "./EditDriverInfoModal";
import EditVehicleModal from "./EditVehicleInfoModal";
import EditLicenseInfoModal from "./EditLicenseInfoModal";

const DriverProfile: React.FC = () => {
  const { auth } = useEssentials();
  const [driver, setDriver] = useState<Driver | null>(null);
  const driverId = auth.user?.email;
  const data = { driverId };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await axios.post("/driver/getDriver", {
          data,
          withCredentials: true,
        });
        setDriver(response.data.user);
        console.log("driverdata", response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (driverId) {
      fetchDriver();
    }
  }, [driverId]);

  const [profilePicture, setProfilePicture] = useState<string>("/placeholder-user.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingDriverInfo, setIsEditingDriverInfo] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState<Vehicle | null>(null);
  const [isEditingLicenseInfo, setIsEditingLicenseInfo] = useState(false);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // setDriver((prevDriver) => ({
    //   ...prevDriver!,
    //   vehicles: prevDriver!.vehicles.map((v) =>
    //     v === isEditingVehicle ? updatedVehicle : v
    //   ),
    // }));
    setIsEditingVehicle(null);
  };

  const handleSaveLicenseInfo = (updatedDriver: Driver) => {
    setDriver(updatedDriver);
    setIsEditingLicenseInfo(false);
  };

  if (!driver) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        <div className="w-full lg:w-1/4 flex justify-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-48 w-48 rounded-full object-cover cursor-pointer border border-gray-300"
                  onClick={() => fileInputRef.current?.click()}
                />
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => fileInputRef.current?.click()}>Change Picture</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full lg:w-3/4 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Driver Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <span>{driver.name}</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="phone">Phone</Label>
                <span>{driver.phone || "NA"}</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="verified">Verified</Label>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full ${driver.verified ? "bg-green-500" : "bg-red-500"
                      }`}
                  />
                  <span>{driver.verified ? "Yes" : "No"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setIsEditingDriverInfo(true)}>Edit Info</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>License Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="license-status">License Status</Label>
                <span>{driver.licenseStatus}</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="license-front">License Front</Label>
                {driver.licenseFrontUrl ? (
                  <img
                    src={driver.licenseFrontUrl}
                    alt="License Front"
                    className="w-32 h-32 object-cover"
                  />
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt="License Front"
                    className="w-32 h-32 object-cover"
                  />
                )}
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="license-back">License Back</Label>
                {driver.licenseBackUrl ? (
                  <img
                    src={driver.licenseBackUrl}
                    alt="License Back"
                    className="w-32 h-32 object-cover"
                  />
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt="License Back"
                    className="w-32 h-32 object-cover"
                  />
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setIsEditingLicenseInfo(true)}>Edit License Info</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              {driver.vehicles && driver.vehicles.map((vehicle, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <Label htmlFor={`vehicle-brand-${index}`}>Brand</Label>
                    <span>{vehicle.brand}</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <Label htmlFor={`vehicle-model-${index}`}>Model</Label>
                    <span>{vehicle.model}</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <Label htmlFor={`vehicle-rc-document-${index}`}>RC Document</Label>
                    <div className="flex items-center gap-4">
                      {vehicle.rcDocumentUrl ? (
                        <img
                          src={vehicle.rcDocumentUrl}
                          width={100}
                          height={100}
                          alt="RC Document"
                          className="rounded"
                        />
                      ) : (
                        <img
                          src="/placeholder.svg"
                          width={100}
                          height={100}
                          alt="RC Document"
                          className="rounded"
                        />
                      )}
                    </div>
                  </div>
                  <Button onClick={() => setIsEditingVehicle(vehicle)}>Edit Vehicle</Button>
                  {driver.vehicles && index < driver.vehicles.length - 1 && (
                    <hr className="border-gray-300 w-full my-4" />
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setIsEditingVehicle({
                brand: "",
                model: "",
                rcDocumentUrl: "",
                status: "",
              })}>Add Vehicle</Button>
            </CardFooter>
          </Card>
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
  );
};

export default DriverProfile;
