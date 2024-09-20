import { Link } from "react-router-dom";
import banner from "../assets/banner/banner.jpg";
import { FaCar, FaMoneyBillAlt, FaTree, FaUsers } from "react-icons/fa";
import TestimonialCard from "../components/Common/TestimonialCard";
import FeatureCard from "../components/Common/FeatureCard";
import { Button } from "../components/ui/button";
import { useEssentials } from "../hooks/UseEssentials";
import Header from "../components/Common/Navbar";
import CreateRide from "../components/driver/CreateRide";
import SearchRide from "../components/user/SearchRideCard";

export default function Home() {

  const { auth } = useEssentials();

  const user = auth.user;



  return (
    <div>
      <Header />
      {/* Hero Section */}
      <div className="bg-hero-image bg-contain bg-center relative bg-[#eaf7f7]">
        <div className="container mx-auto px-4 py-20   flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-4 text-black">
            Carpooling Made Easy
          </h2>
          <p className="text-lg mb-8 text-center max-w-2xl text-black">
            Experience the convenience of carpooling with our modern app. Save
            money, reduce your carbon footprint, and meet new people.
          </p>
          {!user && (
            <div className="flex gap-4">
              <Link to="/login">
                <Button>Create Ride</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">Search Ride</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Create Ride Section */}
      <div className="relative" id="ride-form">
        <div
          className="bg-create-ride-banner bg-cover  flex justify-center h-96"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: "contain",
          }}
        >
          <div className="absolute top-0">
            {user && user.role === "host" && <CreateRide />}
            {user && user.role=== "rider" && <SearchRide />}
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose CarPool?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={FaCar}
              title="Convenience"
              description="Book a ride with just a few taps on your phone."
            />
            <FeatureCard
              icon={FaMoneyBillAlt}
              title="Cost-Effective"
              description="Save money on fuel, tolls, and parking."
            />
            <FeatureCard
              icon={FaTree}
              title="Eco-Friendly"
              description="Reduce your carbon footprint by sharing rides."
            />
            <FeatureCard
              icon={FaUsers}
              title="Social"
              description="Meet new people and make friends on the go."
            />
          </div>
        </div>
      </div>
      {/* Testimonials Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              text="I was skeptical at first, but CarPool has been a game-changer for me. I've met some amazing people and saved so much money!"
              author="- Rachel, San Francisco"
            />
            <TestimonialCard
              text="I was tired of driving alone every day. CarPool has made my commute so much more enjoyable and affordable."
              author="- David, New York"
            />
            <TestimonialCard
              text="I love how easy it is to use CarPool. The app is so user-friendly and the community is super supportive."
              author="- Emily, Los Angeles"
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <p className="text-lg text-gray-800 dark:text-gray-300 text-center">
            &copy; 2023 CarPool. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
