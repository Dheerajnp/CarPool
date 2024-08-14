import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { FaFrown, FaStepBackward } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function NoRidesFound() {
  return (
    <Card className="mx-auto max-w-md p-6 flex flex-col items-center justify-center text-center border-none mt-10">
      <FaFrown className="text-primary h-12 w-12" />
      <h3 className="mt-4 text-2xl font-bold">Sorry, no rides found</h3>
      <p className="mt-2 text-muted-foreground">
        We couldn't find any available rides that match your search. Please try
        adjusting your filters or check back later.
      </p>
      <div className="mt-6">
        <Link to="/user">
          <Button variant="outline">
            <FaStepBackward className="mr-2 h-4 w-4" />
            Go To Home
          </Button>
        </Link>
      </div>
    </Card>
  );
}
