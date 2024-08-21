import { Label } from "../../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosApiGateway from "../../../functions/axios";
import { IRideDetails } from "../../../redux/userStore/RideDetails/RideDetailsInterface";
import RoundLoader from "../../RoundLoader";
import { useEssentials } from "../../../hooks/UseEssentials";
import toast from "react-hot-toast";
import Header from "../../Navbar";
import { MdChatBubble } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

export default function RideDetailsComponent() {
  const { auth, navigate } = useEssentials();
  const [rideDetails, setRideDetails] = useState<IRideDetails | null>(null);
  const { rideId } = useParams();
  let loading;
  useEffect(() => {
    loading = true;
    const getRideDetails = async (rideId: string) => {
      try {
        const response = await axiosApiGateway.get(
          `/user/getRideDetails/${rideId}`
        );
        if (response.data.status === 200) {
          setRideDetails(response.data.ride);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getRideDetails(rideId as string);
    loading = false;
  }, [rideId]);

  const handleRideRequestClick = async (userId: string, rideId: string) => {
    console.log(userId, rideId);
    axiosApiGateway
      .put(`/ride/requestRide/${rideId}`, {
        userId,
        totalPassengers,
      })
      .then((response) => {
        toast.success(response.data.message);
        navigate("/user");
      })
      .catch(({ response }) => {
        toast.error(response.data.message);
      });
  };

  const handleChatClick = async(driverId:string)=>{
    console.log(auth.user?.id)
    const response = await axiosApiGateway.get(`/chat/user/getChat/${auth.user?.id as string}?driverId=${driverId}`)
    console.log(response)
  }
  const formatDate = (dateString: string) => {
    console.log(dateString);
    const date = new Date(dateString);
    console.log(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const [totalPassengers, setTotalPassengers] = useState(1);
  let totalPrice =
    totalPassengers * (rideDetails?.price ? rideDetails.price : 0);
  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <RoundLoader />
    </div>
  ) : (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Ride Details
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Explore the journey from start to finish.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold">From</h2>
                <p className="text-muted-foreground">
                  {rideDetails?.origin.name}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">To</h2>
                <p className="text-muted-foreground">
                  {rideDetails?.destination.name}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Available Seats</h2>
                <p className="text-muted-foreground">
                  {rideDetails?.availableSeats}
                </p>
              </div>
              
              <p className="text-muted-foreground">
              <h2 className="text-xl font-semibold text-black">Distance</h2>
                {rideDetails?.distance
                  ? `${(rideDetails?.distance / 1000).toFixed(2)} K.M's`
                  : "N/A"}
              </p>
              <div>
                <h2 className="text-xl font-semibold">Price per Passenger</h2>
                <p className="text-muted-foreground">{rideDetails?.price}</p>
              </div>
              <div>
                
              </div>
              <div>
                <h2 className="text-xl font-semibold">Date and Time</h2>
                <p className="text-muted-foreground">
                  {rideDetails &&
                    rideDetails.rideDate &&
                    formatDate(rideDetails?.rideDate as string)}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Car Details</h2>
              <p className="text-muted-foreground text-lg mt-2">
                Get to know the vehicle that will take you on your journey.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">
                  The ride will be confirmed only after the request is accepted.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {rideDetails?.vehicle.brand} {rideDetails?.vehicle.model}
                </h3>
                <p className="text-muted-foreground">
                  {rideDetails?.totalSeats} Passenger Capacity
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-2xl font-semibold">Passenger Selection</h2>
              <p className="text-muted-foreground text-lg mt-2">
                Choose the number of passengers for your ride.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="passengers" className="text-base font-medium">
                    Number of Passengers
                  </Label>
                  <Select
                    defaultValue="1"
                    onValueChange={(value) => setTotalPassengers(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: rideDetails?.availableSeats as number },
                        (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Total Price</span>
                  <span className="text-2xl font-bold">₹{totalPrice}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">User Details</h2>
              <p className="text-muted-foreground text-lg mt-2">
                Get to know your driver and request your ride.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border">
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="User Avatar"
                      />
                      <AvatarFallback>
                        {rideDetails?.driver.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {rideDetails?.driver.name}
                      </h3>
                      <h4 className="text-lg font-light">
                        {rideDetails?.driver.email}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FaStar className="w-4 h-4 fill-primary" />
                        <FaStar className="w-4 h-4 fill-primary" />
                        <FaStar className="w-4 h-4 fill-primary" />
                        <FaStar className="w-4 h-4 fill-muted stroke-muted-foreground" />
                        <FaStar className="w-4 h-4 fill-muted stroke-muted-foreground" />
                        <span>4.3</span>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="outline"
                            className="w-12 h-12 border-gray-200 rounded-full hover:text-primary-dark ms-36"
                            onClick={()=>handleChatClick(rideDetails?.driver._id as string)}
                          >
                            <MdChatBubble size={20} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Chat with Driver</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() =>
                    handleRideRequestClick(
                      auth.user?.id as string,
                      rideDetails?._id as string
                    )
                  }
                >
                  Request Ride
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
