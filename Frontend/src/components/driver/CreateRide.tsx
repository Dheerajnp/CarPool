import { useState, ChangeEvent } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import TimePicker from 'react-time-picker';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import classNames from "classnames";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import getLocations from "../../services/getLocations";

interface LocationSuggestion {
  place_name: string;
}

export default function Component() {
  const [sourceSuggestions, setSourceSuggestions] = useState<LocationSuggestion[]>([]);
  const [sourceInput, setSourceInput] = useState<string>("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationInput, setDestinationInput] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string|null>("");

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
    setSuggestions: React.Dispatch<React.SetStateAction<LocationSuggestion[]>>
  ) => {
    setInput(suggestion.place_name);
    setSuggestions([]);
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Create Your Trip</CardTitle>
        <CardDescription>Enter your travel details</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="space-y-2 relative">
          <Label htmlFor="source">From</Label>
          <Input
            id="source"
            placeholder="Enter departure city"
            onChange={handleSourceSearch}
            value={sourceInput}
          />
          {sourceSuggestions.length > 0 && (
            <ul className="bg-white absolute w-[200px] overflow-x-auto h-52">
              {sourceSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-3 cursor-pointer hover:bg-blue-200 dark:bg-black dark:text-white dark:hover:bg-violet-700"
                  onClick={() =>
                    handleSelectSuggestion(suggestion, setSourceInput, setSourceSuggestions)
                  }
                >
                  {suggestion.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>
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
                  onClick={() =>
                    handleSelectSuggestion(suggestion, setDestinationInput, setDestinationSuggestions)
                  }
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
              <Button
                variant="outline"
                className={classNames(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Select date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => setSelectedDate(date || undefined)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
          type="time"
          className="rounded-sm dark:bg-black"
        />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passengers">Passengers</Label>
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
        <Button className="w-full">Create Rides</Button>
      </CardFooter>
    </Card>
  );
}
