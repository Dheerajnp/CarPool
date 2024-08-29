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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  CarIcon,
  MessageCircleIcon,
} from "lucide-react";
import { useEssentials } from "../../../hooks/UseEssentials";
import { useParams } from "react-router-dom";
import { IRideDetails } from "../../../redux/userStore/RideDetails/RideDetailsInterface";
import { useEffect, useState } from "react";
import axiosApiGateway from "../../../functions/axios";
import toast from "react-hot-toast";
import RoundLoader from "../../RoundLoader";
import MapComponent from "../../map/MapComponent";
import Header from "../../Navbar";

export default function RideDetailedViewDriver() {
  const { navigate } = useEssentials();
  const { rideId } = useParams();
  const [rideDetails, setRideDetails] = useState<IRideDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchRideDetails = async () => {
      try {
        const response = await axiosApiGateway.get(
          `/driver/getRideDetails/${rideId}`
        );
        if (response.data.status === 200) {
          setRideDetails(response.data.rideDetails);
        }
      } catch (error: any) {
        console.error("Error fetching ride details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);
  const handleRouteFetched = () => {
    console.log(`Fetching ride details`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleRequestAccept = async (passengerId: string) => {
    try {
      const response = await axiosApiGateway.put(
        `/driver/requestAccept/${rideId}`,
        { passengerId }
      );
      setRideDetails(response.data.rideDetails);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.data.message);
    }
  };

  const handleRequestDeny = async (passengerId: string) => {
    try {
      const response = await axiosApiGateway.put(
        `/driver/requestDeny/${rideId}`,
        { passengerId }
      );
      setRideDetails(response.data.rideDetails);
    } catch (error: any) {
      console.error(error.data.message);
    }
  };
  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <RoundLoader />
    </div>
  ) : (
    <div>
      <Header />
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Ride Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Ride Information</CardTitle>
              <CardDescription>Details about the current ride</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="text-muted-foreground" />
                <span>From: {rideDetails?.origin.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="text-muted-foreground" />
                <span>To: {rideDetails?.destination.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="text-muted-foreground" />
                <span>
                  Date and Time:{" "}
                  {rideDetails &&
                    rideDetails.rideDate &&
                    formatDate(rideDetails?.rideDate as string)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <UsersIcon className="text-muted-foreground me-2" />
                  {rideDetails?.totalSeats && rideDetails?.availableSeats
                  ? `${rideDetails.totalSeats - rideDetails.availableSeats}/${
                      rideDetails.totalSeats
                    }`
                  : "N/A"}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Price per Passenger</h2>
                <p className="text-muted-foreground">{rideDetails?.price}/-</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Vehicle Details</h2>
                  <p className="text-muted-foreground text-lg mt-2">
                    Get to know the vehicle that will take you on your journey.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {rideDetails?.vehicle.brand}{" "}
                        {rideDetails?.vehicle.model}
                      </h3>
                      <p className="text-muted-foreground">
                        {rideDetails?.totalSeats} Passenger Capacity
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Vehicle Number</h3>
                      <p className="text-muted-foreground">
                        {rideDetails?.vehicle.number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ride Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select defaultValue="ongoing">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Update Status</Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Passenger Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rideDetails && rideDetails.passengers.length > 0 ? (
                rideDetails.passengers.map(
                  (passenger, index) =>
                    passenger.status === "pending" && (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40`}
                              alt={passenger.rider.name}
                            />
                            <AvatarFallback>
                              {passenger.rider.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {passenger.rider.name}
                            </p>
                            {/* <p className="text-sm text-muted-foreground">Pickup: {passenger.pickupLocation}</p> */}
                            <p className="text-muted-foreground">
                              Number of Passengers:{" "}
                              {passenger.numberOfPassengers}
                            </p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRequestDeny(passenger.rider._id)
                            }
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleRequestAccept(passenger.rider._id)
                            }
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    )
                )
              ) : (
                <p className="text-muted-foreground">
                  No passengers have requested this ride yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Confirmed Passengers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rideDetails && rideDetails.passengers.length > 0 ? (
                rideDetails.passengers.map(
                  (passenger, index) =>
                    passenger.status === "accepted" && (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40`}
                              alt={passenger.rider.name}
                            />
                            <AvatarFallback>
                              {passenger.rider.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {passenger.rider.name}
                            </p>
                            {/* <p className="text-sm text-muted-foreground">Pickup: {passenger.pickupLocation}</p> */}
                            <p className="text-muted-foreground">
                              Number of Passengers:{" "}
                              {passenger.numberOfPassengers}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge>Confirmed</Badge>
                          <Button size="icon" variant="ghost">
                            <MessageCircleIcon className="h-4 w-4" />
                            <span className="sr-only">
                              Chat with {passenger.rider.name}
                            </span>
                          </Button>
                        </div>
                      </div>
                    )
                )
              ) : (
                <p className="text-muted-foreground">
                  No passengers have confirmed this ride yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Route Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted flex items-center justify-center h-[400px] w-auto rounded-lg overflow-hidden">
              <MapComponent
                from={[
                  rideDetails?.origin.coordinates[0] ?? 0,
                  rideDetails?.origin.coordinates[1] ?? 0,
                ]}
                to={[
                  rideDetails?.destination.coordinates[0] ?? 0,
                  rideDetails?.destination.coordinates[1] ?? 0,
                ]}
                onRouteFetched={handleRouteFetched}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
