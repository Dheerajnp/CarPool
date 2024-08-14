import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../ui/button";
import { IoMdLocate } from "react-icons/io";
import { FaArrowRight, FaUsers, FaCarSide } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { TbFaceIdError } from "react-icons/tb";

import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Calendar } from "../../ui/calendar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format, formatISO } from "date-fns";
import getLocations from "../../../services/getLocations";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { RootState } from "../../../redux/store";
import {
  fetchRidesFailure,
  fetchRidesRequest,
  fetchRidesSuccess,
} from "../../../redux/userStore/Rides/RideListSlice";
import axiosApiGateway from "../../../functions/axios";
import Header from "../../Navbar";
import { SkeletonCard } from "./SkeletonCardSearch";
import NoRidesFound from "./NoridesFoundComponent";
import { Link } from "react-router-dom";

interface LocationSuggestion {
  place_name: string;
  center: [number, number];
}

export default function SearchResultsComponent() {
  const dispatch = useDispatch();
  const rides = useSelector((state: RootState) => state.rides.rides);
  const status = useSelector((state: RootState) => state.rides.status);
  const error = useSelector((state: RootState) => state.rides.error);

  const [filteredRides, setFilteredRides] = useState(rides);
  const [sourceInput, setSourceInput] = useState<string>("");
  const [destinationInput, setDestinationInput] = useState<string>("");
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>(
    []
  );
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [priceRange, setPriceRange] = useState([10, 50]);
  const [selectedSeats, setSelectedSeats] = useState<string | "any">("any");
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 5;

  const fromInputRef = useRef<HTMLDivElement>(null);
  const toInputRef = useRef<HTMLDivElement>(null);

  const formik = useFormik({
    initialValues: {
      from: { name: "", coordinates: [0, 0] } as {
        name: string;
        coordinates: [number, number];
      },
      to: { name: "", coordinates: [0, 0] } as {
        name: string;
        coordinates: [number, number];
      },
      date: undefined as Date | undefined,
    },
    validationSchema: Yup.object({
      from: Yup.object({
        name: Yup.string().required("Departure city is required"),
        coordinates: Yup.array()
          .of(Yup.number())
          .length(2, "Invalid coordinates")
          .required("Departure city coordinates are required"),
      }).required("Departure city is required"),
      to: Yup.object({
        name: Yup.string().required("Arrival city is required"),
        coordinates: Yup.array()
          .of(Yup.number())
          .length(2, "Invalid coordinates")
          .required("Arrival city coordinates are required"),
      }).required("Arrival city is required"),
      date: Yup.date().nullable().required("Date is required"),
    }),
    onSubmit: async (values) => {
      dispatch(fetchRidesRequest());
      const localDate = new Date(values.date ? values.date : "");
      let utcDate = formatISO(localDate);
      try {
        const response = await axiosApiGateway.get("/user/getRides", {
          params: {
            fromName: values.from.name,
            fromCoordinates: values.from.coordinates,
            toName: values.to.name,
            toCoordinates: values.to.coordinates,
            date: utcDate,
          },
        });
        dispatch(fetchRidesSuccess(response.data));
      } catch (error: any) {
        dispatch(fetchRidesFailure(error.message || "Failed to fetch rides"));
      }
    },
  });

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "from") {
      setSourceInput(value);
      if (value === "") {
        setFromSuggestions([]);
      } else {
        const data = await getLocations(value);
        setFromSuggestions(data);
      }
    }

    if (name === "to") {
      setDestinationInput(value);
      if (value === "") {
        setToSuggestions([]);
      } else {
        const data = await getLocations(value);
        setToSuggestions(data);
      }
    }
  };

  const handleSelectSuggestion = (
    suggestion: LocationSuggestion,
    fieldName: "from" | "to"
  ) => {
    formik.setFieldValue(fieldName, {
      name: suggestion.place_name,
      coordinates: suggestion.center,
    });

    if (fieldName === "from") {
      setSourceInput(suggestion.place_name);
      setFromSuggestions([]);
    } else {
      setDestinationInput(suggestion.place_name);
      setToSuggestions([]);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      fromInputRef.current &&
      !fromInputRef.current.contains(e.target as Node) &&
      toInputRef.current &&
      !toInputRef.current.contains(e.target as Node)
    ) {
      setFromSuggestions([]);
      setToSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Set the time to midnight
      date.setHours(0, 0, 0, 0);
    }
    formik.setFieldValue("date", date);
  };
  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleSeatsChange = (value: string) => {
    setSelectedSeats(value);
  };

  const handleFilter = () => {
    let filtered = rides;

    filtered = filtered.filter(
      (ride) => ride.price >= priceRange[0] && ride.price <= priceRange[1]
    );

    if (selectedSeats !== "any") {
      filtered = filtered.filter(
        (ride) => ride.availableSeats >= parseInt(selectedSeats)
      );
    }

    setFilteredRides(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  

  // Pagination calculations
  const indexOfLastRide = currentPage * ridesPerPage;
  const indexOfFirstRide = indexOfLastRide - ridesPerPage;
  const currentRides = filteredRides.slice(indexOfFirstRide, indexOfLastRide);
  const totalPages = Math.ceil(filteredRides.length / ridesPerPage);
  return (
    <div>
      <Header />
      <div className="grid md:grid-cols-[300px_1fr] gap-6 w-full max-w-6xl mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col">
          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
              <CardDescription>Find a carpool ride</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={formik.handleSubmit}>
                <div className="grid gap-2 relative">
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    name="from"
                    placeholder="Enter location"
                    value={sourceInput}
                    onChange={handleInputChange}
                    className="text-lg"
                  />
                  {fromSuggestions.length > 0 && (
                    <div
                      ref={fromInputRef}
                      className="absolute top-full left-0 bg-white shadow-lg z-10 w-full"
                    >
                      {fromSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-200 cursor-pointer relative"
                          onClick={() =>
                            handleSelectSuggestion(suggestion, "from")
                          }
                        >
                          {suggestion.place_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid gap-2 relative">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    name="to"
                    placeholder="Enter location"
                    value={destinationInput}
                    onChange={handleInputChange}
                    className="text-lg"
                  />
                  {toSuggestions.length > 0 && (
                    <div
                      ref={toInputRef}
                      className="absolute top-full left-0 bg-white shadow-lg z-10 w-full"
                    >
                      {toSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-200 cursor-pointer relative"
                          onClick={() =>
                            handleSelectSuggestion(suggestion, "to")
                          }
                        >
                          {suggestion.place_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <SlCalender className="mr-2 h-4 w-4" />
                        {formik.values.date ? (
                          format(formik.values.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formik.values.date}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button type="submit">Search</Button>
              </form>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Filter</CardTitle>
              <CardDescription>Filter by price and seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Label>Seats Available</Label>
                <Select onValueChange={handleSeatsChange} defaultValue="any">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seats available" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
                <Label>Price Range</Label>
                <Box className="px-2">
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={4000}
                    valueLabelFormat={(value) => `${value}`}
                  />
                </Box>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span>₹4000</span>
                </div>
                <Button onClick={handleFilter}>Apply</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="border-black">
          <h1 className="text-2xl font-bold mb-1">Search Results</h1>
          {status === "loading" ? (
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : status === "failed" ? (
            <div className="flex justify-center items-center h-screen">
              <div>
                <div className="flex justify-center text-gray-600">
                  <TbFaceIdError size={60} className="text-center" />
                </div>

                <h1 className="lg:text-6xl font-bold text-2xl text-gray-600 text-center mb-1">
                  Oops!
                </h1>
                <p className="text-xl text-gray-600">
                  Sorry, an unexpected error has occurred.
                </p>
              </div>
            </div>
          ) : filteredRides.length > 0 ? (
            filteredRides.map((ride, index) => (
              <Card
                key={index}
                className="hover:border-indigo-600 hover:shadow-indigo-500 hover:shadow-sm"
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between">
                    <div className="flex align-middle gap-2">
                      <img
                        src={ride.driver.profile ? ride.driver.profile : ""}
                        alt="profile"
                        className="rounded-full border-gray-200 h-10 w-10 mt-2"
                      />
                      <div className="flex flex-col">
                        <span className=" mt-2 text-lg">
                          {ride.driver.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {ride.driver.email}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex align-middle justify-center">
                        <FaCarSide className="h-5 w-5 text-muted-foreground  mt-2 text-center" />
                        <span className="text-lg ml-2 mt-1">
                          {ride.vehicle.brand} {ride.vehicle.model}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-[1fr_auto] gap-4 ">
                  <div className="grid gap-2">
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex items-center">
                        <IoMdLocate className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-lg">{ride.origin.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FaArrowRight className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-lg">{ride.destination.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SlCalender className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {format(new Date(ride.rideDate), "PPP 'at' p")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="h-5 w-5 text-muted-foreground" />
                      <span>{ride.availableSeats} seats available</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl font-bold ">₹{ride.price}</div>
                    <Link to={`/user/ride-details/${ride._id}`}>
                      <Button variant="outline" size="sm">
                        Join Carpool
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
            ))
          ) : (
            <NoRidesFound />
          )}
          {filteredRides.length > ridesPerPage && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="mx-4">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
        </div>
      </div>
    </div>
  );
}
