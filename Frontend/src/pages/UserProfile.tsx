import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/mode-toggle";

export default function UserProfile() {
  const [name, setName] = useState("John Doe");
  const [phone, setPhone] = useState("+1 (555) 555-5555");
  const [verified, setVerified] = useState(true);
  const [documentType, setDocumentType] = useState("Driver's License");
  const [document, setDocument] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState("/placeholder-user.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        <div className="w-full lg:w-1/4 flex justify-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-48 w-48 rounded-full object-cover cursor-pointer border border-gray-300"
                  onClick={() => fileInputRef.current?.click()}
                />
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button  onClick={() => fileInputRef.current?.click()}>
                Change Picture
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full lg:w-3/4 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>User Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" disabled />
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="verified">Verified</Label>
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${verified ? "bg-green-500" : "bg-red-500"}`} />
                  <span>{verified ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Rider" disabled />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Document Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="document-type">Document Type</Label>
                <select
                  id="document-type"
                  className="p-2 border rounded dark:bg-black dark:text-white"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <option value="Driver's License">Driver's License</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="document">Document</Label>
                <div className="flex items-center gap-4">
                  {document ? (
                    <img src={URL.createObjectURL(document)} width={100} height={100} alt="Document" className="rounded" />
                  ) : (
                    <img src="/placeholder.svg" width={100} height={100} alt="Document" className="rounded" />
                  )}
                  <Input
                    id="document"
                    type="file"
                    onChange={(e) => setDocument(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
