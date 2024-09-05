import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEssentials } from "../../../hooks/UseEssentials";
import RoundLoader from "../../RoundLoader";
import Header from "../../Navbar";
import { IRideDetails } from "../../../redux/userStore/RideDetails/RideDetailsInterface";
import axiosApiGateway from "../../../functions/axios";
import { FaArrowRight } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";

export default function MyRides() {
  const { auth } = useEssentials();
  const [rides, setRides] = useState<IRideDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axiosApiGateway.get(
          `/ride/getDriverRides/${auth.user?.id}`
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

  // Group rides by status
  const pendingRides = rides.filter((ride) => ride.status === "pending");
  const ongoingRides = rides.filter((ride) => ride.status === "active");
  const completedRides = rides.filter((ride) => ride.status === "completed");
  const cancelledRides = rides.filter((ride) => ride.status === "cancelled");

  const renderRide = (ride: IRideDetails) => (
    <Link
      to={`/driver/rideDetails/${ride._id}`}
      key={ride._id}
      className="block p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition dark:bg-gray-800"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-1">
            <span>{ride.origin.name}</span>
            <FaArrowRight className="mt-1" />
            <span>{ride.destination.name}</span>
          </h2>
          <p className="text-muted-foreground">
            {new Date(ride.rideDate).toLocaleString()}
          </p>
          <p className="text-muted-foreground">
            Distance: {(ride.distance / 1000).toFixed(2)} K.M's
          </p>
          <p className="text-muted-foreground">
            Available Seats: {ride.availableSeats}
          </p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Status: {ride.status}</p>
        </div>
      </div>
    </Link>
  );

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <RoundLoader />
    </div>
  ) : (
    <div className="dark:bg-gray-900">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 ">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">My Rides</h1>
        <p className="text-muted-foreground text-lg mt-2">
          Here are all the rides you are currently managing.
        </p>

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
            <TabsTrigger value="cancelled" className="py-2 px-4">
              Cancelled Rides
            </TabsTrigger>
          </TabsList>

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

          {/* Cancelled Rides Tab */}
          <TabsContent value="cancelled">
            <div className="grid grid-cols-1 gap-6">
              {cancelledRides.length > 0 ? (
                cancelledRides.map(renderRide)
              ) : (
                <p className="text-muted-foreground">
                  You have no cancelled rides.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
