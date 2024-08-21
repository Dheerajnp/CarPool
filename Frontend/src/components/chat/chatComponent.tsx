import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import Header from "../Navbar";
import { ScrollArea } from "../ui/scroll-area";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { User2Icon } from "lucide-react";
import { FiSend } from "react-icons/fi";

export default function Component() {

  
  return (
    <div className="w-full flex justify-center">
      <header className="bg-background border-b  fixed top-0 left-0 right-0 z-10">
        <Header />
      </header>
      <div className="bg-background rounded-lg w-2/3 border p-6 mt-20 flex flex-col gap-4  h-[calc(100vh-80px)]">
        <div className="sticky top-0 left-0 right-0 bg-background z-10 py-3 -mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Driver Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">Online</div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MdOutlineArrowDropDownCircle className="w-7 h-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User2Icon className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CiPhone className="w-4 h-4 mr-2" />
                  Call
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IoMdClose className="w-4 h-4 mr-2" />
                  Close Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <ScrollArea className="flex-1 overflow-auto -mt-2">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 max-w-[75%]">
                <p className="text-sm text-wrap break-words max-w-full">
                  <span className="block max-w-[90%]">
                    Hey, I'm ready to be picked up. I'm at the front entrance of
                    the building.Explanation:break-words: This utility class
                    ensures that long words will break and wrap onto the next
                    line.max-w-full: Ensures that the paragraph does not exceed
                    the width of its container.max-w-[90%]: Limits the width of
                    the span to 90% of its parent container, ensuring it doesn't
                    overflow.
                  </span>
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  3:45 PM
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-primary rounded-lg p-3 max-w-[75%] text-primary-foreground">
                <p className="text-sm">
                  Okay, I'm on my way. I'll be there in 5 minutes.
                </p>
                <div className="text-xs text-primary-foreground/80 mt-1">
                  3:46 PM
                </div>
              </div>
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Driver Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-primary rounded-lg p-3 max-w-[75%] text-primary-foreground">
                <p className="text-sm">
                  Okay, I'm on my way. I'll be there in 5 minutes.
                </p>
                <div className="text-xs text-primary-foreground/80 mt-1">
                  3:46 PM
                </div>
              </div>
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Driver Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 max-w-[75%]">
                <p className="text-sm">
                  Great, thanks! I'll be waiting for you.
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  3:47 PM
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-primary rounded-lg p-3 max-w-[75%] text-primary-foreground">
                <p className="text-sm">
                  I'm here, let me know when you're ready.
                </p>
                <div className="text-xs text-primary-foreground/80 mt-1">
                  3:48 PM
                </div>
              </div>
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Driver Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 max-w-[75%]">
                <p className="text-sm">Okay, I'm coming down now. Thanks!</p>
                <div className="text-xs text-muted-foreground mt-1">
                  3:49 PM
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="sticky bottom-0 left-0 right-0 bg-background py-4 border-t">
          <div className="relative">
            <Textarea
              placeholder="Type your message..."
              className="pr-16 rounded-xl resize-none min-h-[48px]"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute w-8 h-8 top-3 right-3"
            >
              <FiSend className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
