import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEssentials } from "../../../hooks/UseEssentials";
import RoundLoader from "../../RoundLoader";
import Header from "../../Navbar";
import { IRideDetails } from "../../../redux/userStore/RideDetails/RideDetailsInterface";
import axiosApiGateway from "../../../functions/axios";
import { FaArrowRight } from "react-icons/fa";

export default function MyRides() {
  const { auth } = useEssentials();
  const [rides, setRides] = useState<IRideDetails[]>([]);
  const [loading, setLoading] = useState(false);

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
        <div className="mt-8 grid grid-cols-1 gap-6 ">
          {rides.length > 0 ? (
            rides.map((ride) => (
              <Link
                to={`/driver/rideDetails/${ride._id}`}
                key={ride._id}
                className="block p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition dark:bg-gray-800 "
              >
                <div className="flex justify-between items-center ">
                  <div>
                    <h2 className="text-xl font-semibold flex justify-center align-middle gap-1">
                      <span>{ride.origin.name} </span><FaArrowRight  className="mt-1"/> <span>{ride.destination.name}</span>
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
                    <p className="text-muted-foreground">
                      Status: {ride.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground">
              You have not created any rides yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
