import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"

const SearchRide = () => {
  const [searchDetails, setSearchDetails] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "",
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setSearchDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to server
    console.log(searchDetails);
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Search for a Ride</CardTitle>
        <CardDescription>Enter your travel details</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <Input id="from" name="from" value={searchDetails.from} onChange={handleInputChange} placeholder="Enter departure city" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input id="to" name="to" value={searchDetails.to} onChange={handleInputChange} placeholder="Enter arrival city" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
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
        <div className="space-y-2">
          <Label htmlFor="passengers">Number of Passengers</Label>
          <Select>
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
        </div>
      </CardContent>
      <CardFooter className="col-span-3">
        <Button className="w-full" onClick={handleSubmit}>Search</Button>
      </CardFooter>
    </Card>
  );
}

export default SearchRide
