import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import Header from "../Navbar";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import getLocations from "../../services/getLocations";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RootState } from "../../redux/store";
import { fetchRidesFailure, fetchRidesRequest, fetchRidesSuccess } from "../../redux/userStore/Rides/RideListSlice";
import axiosApiGateway from "../../functions/axios";

interface LocationSuggestion {
  place_name: string;
  center: [number, number];
}

export default function SearchResultsPage() {
  const dispatch = useDispatch();
  const rides = useSelector((state: RootState) => state.rides.rides);
  console.log(rides);
  const status = useSelector((state: RootState) => state.rides.status);
  const error = useSelector((state: RootState) => state.rides.error);

  const [sourceInput, setSourceInput] = useState<string>("");
  const [destinationInput, setDestinationInput] = useState<string>("");
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>(
    []
  );
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
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
      try {
        const response = await axiosApiGateway.get("/api/rides", { params: values });
        dispatch(fetchRidesSuccess(response.data));
      } catch (err:any) {
        dispatch(fetchRidesFailure(err.message));
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-background shadow-sm sticky top-0 z-10">
        <Header />
      </header>
      <div className="container mx-auto px-4 md:px-6 py-8 flex gap-8">
        <aside className="w-64 hidden md:block">
          <h2 className="text-lg font-medium mb-4">Filters</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Location</h3>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="san-francisco">San Francisco</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Departure Date</h3>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Seats Available</h3>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select seats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5+">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Price</h3>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200-300">$200 - $300</SelectItem>
                  <SelectItem value="300+">Above $300</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>
        <main className="flex-1">
          <form
            onSubmit={formik.handleSubmit}
            className="mb-8 space-y-6 bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-1">
                <Label htmlFor="from" className="text-sm font-medium">
                  From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      id="from"
                      name="from"
                      value={sourceInput}
                      onChange={handleInputChange}
                      onFocus={() => {
                        if (sourceInput) {
                          getLocations(sourceInput).then(setFromSuggestions);
                        }
                      }}
                      className="mt-1"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="p-0" ref={fromInputRef}>
                    {fromSuggestions.length > 0 && (
                      <ul className="p-2">
                        {fromSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="cursor-pointer p-2 hover:bg-gray-100"
                            onClick={() =>
                              handleSelectSuggestion(suggestion, "from")
                            }
                          >
                            {suggestion.place_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </PopoverContent>
                </Popover>
                {formik.touched.from && formik.errors.from && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.from.name}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <Label htmlFor="to" className="text-sm font-medium">
                  To
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      id="to"
                      name="to"
                      value={destinationInput}
                      onChange={handleInputChange}
                      onFocus={() => {
                        if (destinationInput) {
                          getLocations(destinationInput).then(
                            setToSuggestions
                          );
                        }
                      }}
                      className="mt-1"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="p-0" ref={toInputRef}>
                    {toSuggestions.length > 0 && (
                      <ul className="p-2">
                        {toSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="cursor-pointer p-2 hover:bg-gray-100"
                            onClick={() =>
                              handleSelectSuggestion(suggestion, "to")
                            }
                          >
                            {suggestion.place_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </PopoverContent>
                </Popover>
                {formik.touched.to && formik.errors.to && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.to.name}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal mt-1 ${
                        !formik.values.date ? "text-muted-foreground" : ""
                      }`}
                    >
                      {formik.values.date ? (
                        format(formik.values.date, "PPP")
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formik.values.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formik.touched.date && formik.errors.date && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.date}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Search
            </Button>
          </form>
          <div>
            {status === "loading" && <p>Loading rides...</p>}
            {status === "failed" && <p>Error: {error}</p>}
            {status === "succeeded" && rides.length === 0 && (
              <p>No rides found. Try adjusting your search criteria.</p>
            )}
            {status === "succeeded" && rides.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rides.map((ride) => (
                  <Card key={ride._id} className="border p-4 rounded-lg">
                    <CardHeader>
                      <div className="flex items-center">
                        <Avatar className="mr-4">
                          <AvatarImage
                            // src={ride.driver.profile}
                            alt={ride.driver.name}
                          />
                          <AvatarFallback>
                            {ride.driver.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium">
                            {ride.driver.name}
                          </h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p>
                          <strong>From:</strong> {ride.origin.name}
                        </p>
                        <p>
                          <strong>To:</strong> {ride.destination.name}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {format(new Date(ride.rideDate), "PPP")}
                        </p>
                        <p>
                          <strong>Seats Available:</strong>{" "}
                          {ride.availableSeats}
                        </p>
                        <p>
                          <strong>Price:</strong> ${ride.price}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
