import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEssentials } from "../../../hooks/UseEssentials";
import RoundLoader from "../../Common/RoundLoader";
import Header from "../../Common/Navbar";
import { IRideDetails } from "../../../redux/userStore/RideDetails/RideDetailsInterface";
import axiosApiGateway from "../../../functions/axios";
import { FaArrowRight } from "react-icons/fa";
import { CalendarCheck } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";

export default function UserRides() {
  const { auth } = useEssentials();
  const [rides, setRides] = useState<IRideDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axiosApiGateway.get(
          `/ride/getUserRides/${auth.user?.id}`
        );
        if (response.data.result.status === 200) {
          setRides(response.data.result.rides);
        }
      } catch (error: any) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [auth.user?.id]);

  // Grouping rides by status
  const pendingRides = rides.filter((ride) => ride.status === "pending");
  const ongoingRides = rides.filter((ride) => ride.status === "active");
  const completedRides = rides.filter((ride) => ride.status === "completed");
  const canceledRides = rides.filter((ride) => ride.status === "cancelled");

  const renderRide = (ride: IRideDetails) => {
    const userPassenger = ride.passengers.find(
      (passenger) => passenger.rider.id === auth.user?._id
    );
    if (!userPassenger) return null;

    return (
      <Link
        to={`/user/rideDetails/${ride._id}`}
        key={ride._id}
        className="block p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition dark:bg-gray-800"
      >
        <div className="flex-col justify-between items-center align-bottom">
          <div>
            <h2 className="text-md font-normal flex gap-1 mb-1 ">
              <span className="text-wrap break-words max-w-[40%]">
                {ride.origin.name}
              </span>
              <FaArrowRight className="mt-1 mr-4" />
              <span className="text-wrap break-words max-w-[30%]">
                {ride.destination.name}
              </span>
            </h2>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-muted-foreground text-sm flex">
                <CalendarCheck size={16} className="mt-[2px] mr-1" />
                {new Date(ride.rideDate).toLocaleString()}
              </p>
              <p className="text-muted-foreground text-sm">
                Distance: {(ride.distance / 1000).toFixed(2)} K.M's
              </p>
              <p className="text-muted-foreground text-sm">
                Ride Status: {ride.status}
              </p>
              <p className="text-muted-foreground text-sm">
                Number of Passengers: {ride.passengers.length}
              </p>
            </div>
            <div className="text-left mt-8">
              <p className="text-muted-foreground">
                Status: {userPassenger.status}
              </p>
              <p className="text-muted-foreground">
                Number of Seats Reserved: {userPassenger.numberOfPassengers}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <RoundLoader />
    </div>
  ) : (
    <div className="dark:bg-gray-900 h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <Tabs defaultValue="pending">
          <TabsList className="flex space-x-4 mb-8">
            <TabsTrigger value="pending" className="py-2 px-4">
              Pending Rides
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="py-2 px-4">
              Ongoing Rides
            </TabsTrigger>
            <TabsTrigger value="completed" className="py-2 px-4">
              Completed Rides
            </TabsTrigger>
            <TabsTrigger value="canceled" className="py-2 px-4">
              Canceled Rides
            </TabsTrigger>
          </TabsList>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            My Rides
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Here are all the rides you have joined.
          </p>

          {/* Pending Rides Tab */}
          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-6">
              {pendingRides.length > 0 ? (
                pendingRides.map(renderRide)
              ) : (
                <p className="text-muted-foreground">
                  You have no pending rides.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Ongoing Rides Tab */}
          <TabsContent value="ongoing">
            <div className="grid grid-cols-1 gap-6">
              {ongoingRides.length > 0 ? (
                ongoingRides.map(renderRide)
              ) : (
                <p className="text-muted-foreground">
                  You have no ongoing rides.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Completed Rides Tab */}
          <TabsContent value="completed">
            <div className="grid grid-cols-1 gap-6">
              {completedRides.length > 0 ? (
                completedRides.map(renderRide)
              ) : (
                <p className="text-muted-foreground">
                  You have no completed rides.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Canceled Rides Tab */}
          <TabsContent value="canceled">
            <div className="grid grid-cols-1 gap-6">
              {canceledRides.length > 0 ? (
                canceledRides.map(renderRide)
              ) : (
                <p className="text-muted-foreground">
                  You have no canceled rides.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
