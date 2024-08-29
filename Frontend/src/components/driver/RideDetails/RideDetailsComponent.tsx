import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosApiGateway from "../../../functions/axios";
import { IRideDetails } from "../../../redux/userStore/RideDetails/RideDetailsInterface";
import RoundLoader from "../../RoundLoader";
import Header from "../../Navbar";
import toast from "react-hot-toast";
import { useEssentials } from "../../../hooks/UseEssentials";

export default function RideDetailsForDriver() {
  const {navigate} = useEssentials();
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
      toast.success(response.data.message)
    } catch (error:any) {
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
    } catch (error:any) {
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          Ride Details
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Manage your ride and track its status.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
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
              <div>
                <h2 className="text-xl font-semibold">Price per Passenger</h2>
                <p className="text-muted-foreground">{rideDetails?.price}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Distance</h2>
                <p className="text-muted-foreground">
                  {rideDetails?.distance
                    ? `${(rideDetails?.distance / 1000).toFixed(2)} K.M's`
                    : "N/A"}
                </p>
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

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Vehicle Details</h2>
              <p className="text-muted-foreground text-lg mt-2">
                Get to know the vehicle that will take you on your journey.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {rideDetails?.vehicle.brand} {rideDetails?.vehicle.model}
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

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Passengers</h2>
            <div className="mt-4 space-y-4">
              {rideDetails && rideDetails?.passengers.length > 0 ? (
                rideDetails.passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-lg font-semibold">
                          {passenger.rider.name}
                        </p>
                        <p className="text-muted-foreground">
                          Number of Passengers: {passenger.numberOfPassengers}
                        </p>
                        <p className="text-muted-foreground">
                          Status: {passenger.status}
                        </p>
                      </div>
                    </div>
                    {passenger.status === "pending" && (
                      <div>
                        <Button
                          size="sm"
                          className="bg-blue-500"
                          onClick={() => handleRequestAccept(passenger.rider._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500 ml-4"
                          onClick={() => handleRequestDeny(passenger.rider._id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No passengers have requested this ride yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
