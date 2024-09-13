import { useState, useRef, useEffect } from "react";
import { GoMail } from "react-icons/go";
import { FaPhone } from "react-icons/fa6";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import imgPlaceholder from "../../../assets/imgPlaceholder.png";
import axiosApiGateway from "../../../functions/axios";
import { useEssentials } from "../../../hooks/UseEssentials";
import { User } from "../../../redux/userStore/Authentication/interfaces";
import toast from "react-hot-toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import Header from "../../../components/Navbar";
import EditDocumentModal from "../../../components/user/profile/EditDocumentModal";
import EditUserInfoModal from "../../../components/user/profile/EditUserInfoModal";
import LoaderCentered from "../../../components/Common/LoaderCentered";

export default function UserProfile() {
  // const [document, setDocument] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { auth } = useEssentials();
  const userId = auth.user?.id;
  const [profilePicture, setProfilePicture] = useState("/placeholder-user.jpg");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditUserInfoOpen, setIsEditUserInfoOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await axiosApiGateway.get(`/user/getUser/${userId}`);
      if (response.data.status === 200) {
        setUser(response.data.user);
      } else {
        toast.error(response.data.message);
      }
      setLoading(false);
    };
    fetchUser();
  }, [userId]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setDocument(file);
  //   }
  // };

  const handleSaveDocument = (updatedDocument: {
    type: string;
    url: string;
  }) => {
    setUser(
      (prevUser) =>
        ({
          ...prevUser,
          documents: updatedDocument,
        } as User)
    );
    setIsEditModalOpen(false);
  };

  const handleSaveInfo = (updatedUser: any) => {
    setUser(updatedUser);
    setIsEditUserInfoOpen(false);
  };

  return (
    <div className="w-full min-h-screen dark:bg-gray-800">
      <Header />
      {loading ? (
        <>
          <LoaderCentered />
        </>
      ) : (
        <>
          <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-12">
            <div className="grid gap-8 md:grid-cols-2 border rounded-md dark:shadow-indigo-500 dark:bg-slate-900 dark:text-white p-5">
              <div className="bg-background rounded-lg shadow-sm p-6 space-y-6 col-span-2 dark:bg-slate-800">
                <div className="flex items-center gap-4 dark:bg-slate-800">
                  <label htmlFor="avatar-input">
                    <Avatar className="h-16 w-16 cursor-pointer">
                      <AvatarImage src={profilePicture} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                  <div className="flex items-center gap-2 dark:bg-slate-800">
                    <div className="font-semibold text-lg">{user?.name}</div>
                    <Badge variant="secondary" className="px-2 py-1 text-xs">
                      {user?.verified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    className="ml-auto"
                    onClick={() => setIsEditUserInfoOpen(true)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid gap-2 dark:bg-slate-800">
                  <div className="flex items-center gap-2">
                    <GoMail className="h-5 w-5 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="h-5 w-5 text-muted-foreground" />
                    <span>{user?.phone || "NA"}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 bg-background rounded-lg shadow-sm p-6 space-y-6 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">Document Info</div>
                </div>
                <div className="grid gap-4">
                  {user?.documents ? (
                    <div className="flex justify-between items-center gap-4">
                      <img
                        src={user.documents.url}
                        width={100}
                        height={100}
                        alt="Document"
                        className="rounded"
                      />
                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <span>Type: {user.documents.type}</span>
                          <span>Status: {user.documents.status}</span>
                        </div>
                        <Button
                          className="mt-2"
                          size="sm"
                          onClick={() => setIsEditModalOpen(true)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <img
                        src={imgPlaceholder}
                        width={100}
                        height={100}
                        alt="Document"
                        className="rounded"
                      />
                      <Button
                        size="sm"
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        Add Document
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isEditModalOpen && user && (
        <EditDocumentModal
          document={{ type: "", url: "", status: "" }}
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveDocument}
        />
      )}

      {isEditUserInfoOpen && user && (
        <EditUserInfoModal
          user={user}
          onClose={() => setIsEditUserInfoOpen(false)}
          onSave={handleSaveInfo}
        />
      )}
    </div>
  );
}
