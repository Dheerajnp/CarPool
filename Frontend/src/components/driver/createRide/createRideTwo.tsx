import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import MapComponent from "../../map/MapComponent";
import Header from "../../Navbar";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useEssentials } from "../../../hooks/UseEssentials";
import axiosApiGateway from "../../../functions/axios";

const CreateRideStageTwo = () => {
    const { dispatch,navigate,ride, driver } = useEssentials();
    const [route, setRoute] = useState<any>(null);
    const [suggestedPriceRange, setSuggestedPriceRange] = useState<[number, number]>([0, 0]);
    const formik = useFormik({
    initialValues: {
      price: "",
    },
    validationSchema: Yup.object({
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be a positive number"),
    }),
    onSubmit: async(values) => {
        console.log(values);
        const data = {
            price: values.price,
            source: ride.source,
            destination: ride.destination,
            date: ride.date,
            time: ride.time,
            passengers: ride.passengers,
            distance: route?.distance,
            duration: route?.duration,
        }
      const response = await axiosApiGateway.post(`/driver/create-ride/${driver.driver?._id}`, {data});

    },
  });

  const handleRouteFetched = (route: any) => {
    setRoute(route);
  };



  useEffect(() => {
    
    if(!ride.destination||!ride.source){
        toast.error("Enter the ride details again");
        navigate("/user");
    }
    if (route) {
      const distance = route.distance / 1000;
      console.log(distance);
      const basePrice = 3 * distance + 10;
      console.log(basePrice);
      const minPrice = basePrice * 0.94;
      const maxPrice = basePrice * 1.1;
      console.log(minPrice, maxPrice);
      setSuggestedPriceRange([minPrice, maxPrice]);
    }
  }, [route]);

  const getSuggestedPriceBgColor = () => {
    const price = parseFloat(formik.values.price);
    if (price < suggestedPriceRange[0]) {
      return "bg-yellow-400";
    } else if (price > suggestedPriceRange[1]) {
      return "bg-red-400";
    } else {
      return "bg-green-400";
    }
  };

  

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col justify-between px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Create Ride - Step 2</h2>
          <Link to="/user">
            <Button variant="outline">Back to Step 1</Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-start mb-16">
          <div className="flex flex-col w-full md:w-1/2 md:pr-4 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="flex items-center text-lg font-medium mr-4">
                <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">1</div>
                Ride Details
              </div>
              <div className="w-16 border-t-2 border-blue-500 mx-4 hidden md:block"></div>
              <div className="flex items-center text-lg font-medium">
                <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">2</div>
                Price & Map
              </div>
            </div>
            <form onSubmit={formik.handleSubmit} className="flex flex-col">
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price per Seat
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price ? (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.price}
                  </div>
                ) : null}
                {route && (
                  <p className={`text-sm text-gray-700 mt-2  rounded-full p-1 px-2  inline-block ${formik.values.price ? getSuggestedPriceBgColor() : ''}`}>
                    Suggested price range: ₹{suggestedPriceRange[0].toFixed(2)} - ₹{suggestedPriceRange[1].toFixed(2)}
                  </p>
                )}
              </div>
              <Button 
              type="submit" 
              className="mt-4 w-full md:w-auto"
              >
                Create Ride
              </Button>
            </form>
            {route && (
              <div className="mt-8 bg-white p-4 rounded-lg shadow-md dark:bg-gray-900">
                <h3 className="text-lg font-bold mb-2">Route Details</h3>
                <p>Distance: {(route.distance / 1000).toFixed(2)} KM's</p>
                <p>Duration: {(route.duration / 60).toFixed(2)} minutes</p>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 md:pl-4">
            <div className="h-[40vh] md:h-[60vh] w-full rounded-lg">
                {ride.source && ride.destination && (
              <MapComponent from={[ride.source.coordinates[0], ride.source.coordinates[1]]} to={[ride.destination.coordinates[0], ride.destination.coordinates[1]]} onRouteFetched={handleRouteFetched} />
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRideStageTwo;
