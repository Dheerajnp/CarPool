import { useState, ChangeEvent } from "react";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import classNames from "classnames";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import getLocations from "../../services/getLocations";
import { setRideDetails } from "../../redux/rideStore/rideSlice";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";

interface LocationSuggestion {
  place_name: string;
  center: [number, number];
}

const validationSchema = Yup.object().shape({
  source: Yup.object().shape({
    name: Yup.string().required("Please select a departure city"),
    coordinates: Yup.array().of(Yup.number()).length(2, "Invalid coordinates").required("Departure city coordinates are required"),
  }).required("Departure city is required"),
  destination: Yup.object().shape({
    name: Yup.string().required("Please select an arrival city"),
    coordinates: Yup.array().of(Yup.number()).length(2, "Invalid coordinates").required("Arrival city coordinates are required"),
  }).required("Arrival city is required"),
  date: Yup.date().required("Date is required"),
  time: Yup.date().required("Time is required"),
  passengers: Yup.number().required("Number of passengers is required"),
});

export default function Component() {
  const [sourceSuggestions, setSourceSuggestions] = useState<LocationSuggestion[]>([]);
  const [sourceInput, setSourceInput] = useState<string>("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationInput, setDestinationInput] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      source: { name: "", coordinates: [0, 0] } as { name: string, coordinates: [number, number] },
      destination: { name: "", coordinates: [0, 0] } as { name: string, coordinates: [number, number] },
      date: undefined as Date | undefined,
      time: undefined as Date | undefined,
      passengers: 1,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(setRideDetails(values));
      navigate("/driver/create-ride");
    },
  });

  const handleSourceSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const searchedTerm = e.target.value;
      setSourceInput(searchedTerm);
      const data = await getLocations(searchedTerm);
      setSourceSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDestinationSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const searchedTerm = e.target.value;
      setDestinationInput(searchedTerm);
      const data = await getLocations(searchedTerm);
      setDestinationSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectSuggestion = (
    suggestion: LocationSuggestion,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    fieldName: 'source' | 'destination'
  ) => {
    setInput(suggestion.place_name);
    formik.setFieldValue(fieldName, {
      name: suggestion.place_name,
      coordinates: suggestion.center,
    });
    if (fieldName === 'source') {
      setSourceSuggestions([]);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value;
    if (timeString) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const timeDate = set(new Date(), { hours, minutes, seconds: 0, milliseconds: 0 });
      formik.setFieldValue('time', timeDate);
    } else {
      formik.setFieldValue('time', undefined);
    }
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Create Your Trip</CardTitle>
        <CardDescription>Enter your travel details</CardDescription>
      </CardHeader>
      <form onSubmit={formik.handleSubmit}>
        <CardContent className="grid grid-cols-3 gap-4">
          {/* Source input */}
          <div className="space-y-2 relative">
            <Label htmlFor="source">From</Label>
            <Input
              id="source"
              placeholder="Enter departure city"
              onChange={handleSourceSearch}
              value={sourceInput}
            />
            {sourceSuggestions.length > 0 && (
              <ul className="bg-white absolute w-[200px] overflow-x-auto h-52 z-30">
                {sourceSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 cursor-pointer hover:bg-blue-200 dark:bg-black dark:text-white dark:hover:bg-violet-700"
                    onClick={() => handleSelectSuggestion(suggestion, setSourceInput, 'source')}
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            )}
            {formik.touched.source && formik.errors.source && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.source.name || formik.errors.source.coordinates}</div>
            )}
          </div>

          {/* Destination input */}
          <div className="space-y-2 relative">
            <Label htmlFor="destination">To</Label>
            <Input
              id="destination"
              placeholder="Enter arrival city"
              onChange={handleDestinationSearch}
              value={destinationInput}
            />
            {destinationSuggestions.length > 0 && (
              <ul className="bg-white absolute w-[200px] overflow-x-auto h-52">
                {destinationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 cursor-pointer hover:bg-blue-200 dark:bg-black dark:text-white dark:hover:bg-violet-700"
                    onClick={() => handleSelectSuggestion(suggestion, setDestinationInput, 'destination')}
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            )}
            {formik.touched.destination && formik.errors.destination && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.destination.name || formik.errors.destination.coordinates}</div>
            )}
          </div>

          {/* Date input */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={classNames(
                    "w-full justify-start text-left font-normal",
                    !formik.values.date && "text-muted-foreground"
                  )}
                >
                  {formik.values.date ? (
                    format(formik.values.date, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formik.values.date}
                  onSelect={(date) => formik.setFieldValue('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formik.touched.date && formik.errors.date && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.date}</div>
            )}
          </div>

          {/* Time input */}
          <div className="space-y-2 mt-1">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Time
            </label>
            <div className="relative">
              <input
                type="time"
                id="time"
                onChange={handleTimeChange}
                value={formik.values.time ? format(formik.values.time, "HH:mm") : ""}
                className="block w-full px-3 py-2 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500 sm:text-sm"
              />
              {/* <ClockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
            </div>
            {formik.touched.time && formik.errors.time && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.time}</div>
            )}
          </div>

          {/* Passengers input */}
          <div className="space-y-2">
            <Label htmlFor="passengers">Passengers</Label>
            <Select onValueChange={(value) => formik.setFieldValue('passengers', Number(value))}>
              <SelectTrigger id="passengers">
                <SelectValue placeholder="1 passenger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 passenger</SelectItem>
                <SelectItem value="2">2 passengers</SelectItem>
                <SelectItem value="3">3 passengers</SelectItem>
                <SelectItem value="4">4 passengers</SelectItem>
                <SelectItem value="5">5 passengers</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.passengers && formik.errors.passengers && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.passengers}</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="col-span-3">
          <Button className="w-full" type="submit">Create Ride</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
