import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

const CreateRide1 = () => {
  const [rideDetails, setRideDetails] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    seats: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setRideDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to server
    console.log(rideDetails);
  };

  return (
    <div className="container mx-auto px-4 py-20" id="create-ride-form">
      <Card className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-white">Create a Ride</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap -mx-4">
          <form onSubmit={handleSubmit} className="flex flex-wrap -mx-4 w-full">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Label htmlFor="origin" className="block mb-2 text-white">Origin:</Label>
              <Input
                type="text"
                id="origin"
                name="origin"
                value={rideDetails.origin}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Label htmlFor="destination" className="block mb-2 text-white">Destination:</Label>
              <Input
                type="text"
                id="destination"
                name="destination"
                value={rideDetails.destination}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
              />
            </div>
            <div className="w-full md:w-1/3 px-4 mb-4">
              <Label htmlFor="date" className="block mb-2 text-white">Date:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <span id="date">Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-4">
              <Label htmlFor="time" className="block mb-2 text-white">Time:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <span id="time">Select time</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-4">
              <Label htmlFor="seats" className="block mb-2 text-white">Number of Seats:</Label>
              <Select>
                <SelectTrigger id="seats">
                  <SelectValue placeholder="Select seats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 seat</SelectItem>
                  <SelectItem value="2">2 seats</SelectItem>
                  <SelectItem value="3">3 seats</SelectItem>
                  <SelectItem value="4">4 seats</SelectItem>
                  <SelectItem value="5">5 seats</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full px-4">
              <Button type="submit" className="w-full bg-blue-400 text-white py-2 px-4 rounded-md hover:bg-blue-300 transition-colors duration-300 shadow-md">
                Create Ride
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateRide1;
