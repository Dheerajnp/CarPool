import {
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  CarIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { toast as usetoast } from "../../ui/use-toast";
import { useState, useEffect } from "react";
import { IRideDetails } from "../../../redux/userStore/RideDetails/RideDetailsInterface"; // import the IRideDetails interface
import { useParams } from "react-router-dom";
import axiosApiGateway from "../../../functions/axios";
import RoundLoader from "../../RoundLoader";
import { useEssentials } from "../../../hooks/UseEssentials";
import toast from "react-hot-toast";

export default function RideDetailsPage() {
  const [rideData, setRideData] = useState<IRideDetails | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { rideId } = useParams();
  const { auth, navigate } = useEssentials();

  useEffect(() => {
    const fetchRideDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosApiGateway.get(
          `/ride/getRideDetails/${rideId}`
        );
        setRideData(response.data.result.rideDetails);
      } catch (error) {
        console.error("Error fetching ride details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);


  const handleCancelRide = () => {
    setIsDialogOpen(false);
    usetoast({
      title: "Ride Cancelled",
      description: "Your ride has been successfully cancelled.",
    });
    // Handle the API call for cancelling the ride
  };

  const handleChatClick = async (driverId: string) => {
    const response = await axiosApiGateway.get(
      `/chat/user/getChat/${auth.user?.id as string}?driverId=${driverId}`
    );
    if (response.data.result.status === 200) {
      navigate(`/chat?roomId=${response.data.result.chat.roomId}`);
    } else {
      toast("Unable to initiate chat with driver. Please try again later.");
    }
  };

  const getRideStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "active":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center min-h-screen">
      <RoundLoader />
    </div>
  ) : (
    rideData && (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Ride Details</CardTitle>
                <CardDescription>Ride ID: {rideData._id}</CardDescription>
              </div>
              <Badge
                className={`text-lg px-3 py-1 ${getRideStatusColor(
                  rideData.status
                )}`}
              >
                {rideData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  <span>{new Date(rideData.rideDate).toLocaleString()}</span>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">From:</span>
                  <span>{rideData.origin.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">To:</span>
                  <span>{rideData.destination.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                <span>{rideData.totalSeats} seats total</span>
              </div>
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">Vehicle Details</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CarIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">
                      {rideData.vehicle.brand} {rideData.vehicle.model}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>License Plate: {rideData.vehicle.number}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Driver</h3>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={rideData.driver.profile}
                      alt={rideData.driver.name}
                    />
                    <AvatarFallback>
                      {rideData.driver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{rideData.driver.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {rideData.driver.email}
                    </p>
                  </div>
                </div>
              </div>
              {rideData.passengers.map((passenger, index) => (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Passengers</h3>
                  <ul className="space-y-2">
                    <li key={index} className="flex items-center gap-2">
                      <Avatar>
                        {/* Replace with passenger profile picture if available */}
                        <AvatarFallback>
                          {passenger.rider.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {passenger.rider.name} ({passenger.numberOfPassengers}{" "}
                        seat(s))
                      </span>
                    </li>
                  </ul>
                  <h3 className="text-lg font-semibold mb-2">Price</h3>
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                      <Badge variant="secondary" className="text-lg">
                        {" "}
                        ₹ {rideData.price} per seat{" "}
                      </Badge>
                      <div className="text-lg">
                        {" "}
                        Total : ₹ {rideData.price * passenger.numberOfPassengers} 
                      </div>
                    </div>
                    <div>
                      {rideData.status === "completed" && (
                        <Button
                          variant={"ghost"}
                          onClick={() => setIsDialogOpen(true)}
                        >
                          Pay for the ride
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">Cancel Ride</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to cancel this ride?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. You may be charged a
                    cancellation fee.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    No, keep the ride
                  </Button>
                  <Button variant="destructive" onClick={handleCancelRide}>
                    Yes, cancel the ride
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              onClick={() => handleChatClick(rideData?.driver._id as string)}
            >
              Contact Driver
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  );
}
