import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axiosApiGateway from "../../../functions/axios";
import PaymentStatus from "../../../components/user/PaymentConfirmation/PaymentConfirmation";
import { IRideDetails } from "../../../redux/userStore/RideDetails/RideDetailsInterface";
import LoaderCentered from "../../../components/Common/LoaderCentered";

const PaymentStatusPage = () => {
  const [rideData, setRideData] = useState<IRideDetails | null>(null);
  const { rideId } = useParams();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("success");
  const isSuccessfull = status==="true"?true :false;

  useEffect(() => {
    axiosApiGateway
      .get(`/ride/getRideDetails/${rideId}`)
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          setRideData(response.data.result.rideDetails);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },[rideId]);

  return (
    <>
      {rideData ? (
        <PaymentStatus
          amount={rideData?.price}
          isSuccessful={isSuccessfull}
          date={new Date(rideData.rideDate).toLocaleString()}
          destination={rideData.destination.name}
          driver={rideData?.driver.name}
        />
      ):(
        <>
        <LoaderCentered />
        </>
      )}
    </>
  );
};

export default PaymentStatusPage;
