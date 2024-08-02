import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import getLocations from "../../services/getLocations";
import { format, formatISO } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchRidesFailure, fetchRidesRequest, fetchRidesSuccess } from '../../redux/userStore/Rides/RideListSlice';
import axiosApiGateway from '../../functions/axios';
import { useNavigate } from 'react-router-dom';

interface LocationSuggestion {
  place_name: string;
  center: [number, number];
}

const SearchRide: React.FC = () => {
  const [sourceInput, setSourceInput] = useState<string>("");
  const [destinationInput, setDestinationInput] = useState<string>("");
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const fromInputRef = useRef<HTMLDivElement>(null);
  const toInputRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      from: { name: "", coordinates: [0, 0] } as { name: string, coordinates: [number, number] },
      to: { name: "", coordinates: [0, 0] } as { name: string, coordinates: [number, number] },
      date: undefined as Date | undefined,
    },
    validationSchema: Yup.object({
      from: Yup.object({
        name: Yup.string().required('Departure city is required'),
        coordinates: Yup.array().of(Yup.number()).length(2, 'Invalid coordinates').required('Departure city coordinates are required'),
      }).required('Departure city is required'),
      to: Yup.object({
        name: Yup.string().required('Arrival city is required'),
        coordinates: Yup.array().of(Yup.number()).length(2, 'Invalid coordinates').required('Arrival city coordinates are required'),
      }).required('Arrival city is required'),
      date: Yup.date().nullable().required('Date is required'),
    }),
    onSubmit: async(values) => {
      dispatch(fetchRidesRequest());
        const localDate = new Date(values.date?values.date:"");
        let utcDate = formatISO(localDate);
        console.log(utcDate);
      try {
        const response = await axiosApiGateway.get('/user/getRides', {
          params: {
            fromName: values.from.name,
            fromCoordinates: values.from.coordinates,
            toName: values.to.name,
            toCoordinates: values.to.coordinates,
            date:utcDate,
          },
        });
        console.log(response.data)
        dispatch(fetchRidesSuccess(response.data));
        navigate('/search')
      } catch (error: any) {
        dispatch(fetchRidesFailure(error.message || 'Failed to fetch rides'));
      }
    }
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

  const handleSelectSuggestion = (suggestion: LocationSuggestion, fieldName: 'from' | 'to') => {
    formik.setFieldValue(fieldName, {
      name: suggestion.place_name,
      coordinates: suggestion.center,
    });

    if (fieldName === 'from') {
      setSourceInput(suggestion.place_name);
      setFromSuggestions([]);
    } else {
      setDestinationInput(suggestion.place_name);
      setToSuggestions([]);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      fromInputRef.current && !fromInputRef.current.contains(e.target as Node) &&
      toInputRef.current && !toInputRef.current.contains(e.target as Node)
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
    formik.setFieldValue('date', date);
  };
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Search for a Ride</CardTitle>
          <CardDescription>Enter your travel details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="space-y-2 relative" ref={fromInputRef}>
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              name="from"
              value={sourceInput}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              placeholder="Enter departure city"
            />
            {formik.touched.from && formik.errors.from ? (
              <div className="text-red-500 text-[11px]">{formik.errors.from.name || formik.errors.from.coordinates}</div>
            ) : null}
            {fromSuggestions.length > 0 && (
              <ul className="bg-white absolute w-full overflow-x-auto h-52 z-30">
                {fromSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 cursor-pointer hover:bg-blue-200 dark:bg-black dark:text-white dark:hover:bg-violet-700"
                    onClick={() => handleSelectSuggestion(suggestion, 'from')}
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-2 relative" ref={toInputRef}>
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              name="to"
              value={destinationInput}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              placeholder="Enter arrival city"
            />
            {formik.touched.to && formik.errors.to ? (
              <div className="text-red-500 text-[11px]">{formik.errors.to.name || formik.errors.to.coordinates}</div>
            ) : null}
            {toSuggestions.length > 0 && (
              <ul className="bg-white absolute w-full overflow-x-auto h-52 z-30">
                {toSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 cursor-pointer hover:bg-blue-200 dark:bg-black dark:text-white dark:hover:bg-violet-700"
                    onClick={() => handleSelectSuggestion(suggestion, 'to')}
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {formik.values.date ? format(formik.values.date, "PPP") : <span id="date">Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formik.values.date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formik.touched.date && formik.errors.date ? (
              <div className="text-red-500 text-[11px]">{formik.errors.date}</div>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="col-span-3">
          <Button type="submit" className="w-full">Search</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default SearchRide;
