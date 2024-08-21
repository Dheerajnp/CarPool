import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"

export default function Chat() {
  return (
    <div className="flex min-h-screen">
      <div className="bg-background border-r w-72 flex flex-col">
        <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center">
          <div className="flex items-center">
            <Avatar className="mr-4">
              <AvatarImage src="/placeholder-user.jpg" alt="Driver Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">John Doe</div>
              <div className="text-sm text-primary-foreground/80">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
                  Online
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-2 p-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer">
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <div className="font-medium">Jane Doe</div>
                <div className="text-sm text-muted-foreground truncate">Hey there, how's it going?</div>
              </div>
              <div className="text-xs text-muted-foreground">3:45 PM</div>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer">
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <div className="font-medium">Sarah Miller</div>
                <div className="text-sm text-muted-foreground truncate">Did you see the new design update?</div>
              </div>
              <div className="text-xs text-muted-foreground">2:30 PM</div>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer">
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <div className="font-medium">Michael Johnson</div>
                <div className="text-sm text-muted-foreground truncate">Let's discuss the project timeline.</div>
              </div>
              <div className="text-xs text-muted-foreground">1:15 PM</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-screen flex-1">
        <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-primary/20">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex items-center">
            <Avatar className="mr-4">
              <AvatarImage src="/placeholder-user.jpg" alt="Driver Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">John Doe</div>
              <div className="text-sm text-primary-foreground/80">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
                  Online
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" alt="Your Avatar" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 bg-muted rounded-lg p-4 max-w-[80%]">
                <div className="font-medium">You</div>
                <div>Hi John, I'm at the pickup location. Where are you?</div>
                <div className="text-xs text-muted-foreground">3:45 PM</div>
              </div>
            </div>
            <div className="flex items-start gap-4 justify-end">
              <div className="grid gap-1 bg-primary text-primary-foreground rounded-lg p-4 max-w-[80%]">
                <div className="font-medium">John</div>
                <div>I'm just around the corner, be there in 2 minutes.</div>
                <div className="text-xs text-primary-foreground/80">3:46 PM</div>
              </div>
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" alt="Driver Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" alt="Your Avatar" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 bg-muted rounded-lg p-4 max-w-[80%]">
                <div className="font-medium">You</div>
                <div>Sounds good, I'll wait for you.</div>
                <div className="text-xs text-muted-foreground">3:47 PM</div>
              </div>
            </div>
            <div className="flex items-start gap-4 justify-end">
              <div className="grid gap-1 bg-primary text-primary-foreground rounded-lg p-4 max-w-[80%]">
                <div className="font-medium">John</div>
                <div>I'm here, let me know when you're ready to go.</div>
                <div className="text-xs text-primary-foreground/80">3:48 PM</div>
              </div>
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" alt="Driver Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <div className="bg-muted p-4 flex items-center">
          <Textarea placeholder="Type your message..." className="flex-1 mr-4 rounded-lg border-none focus:ring-0" />
          <Button>
            <SendIcon className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}


function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}