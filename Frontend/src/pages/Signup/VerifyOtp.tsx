import { useEffect, useState } from 'react'
import { useEssentials } from '../../hooks/UseEssentials';
import VerifyUser from '../../components/auth/VerifyUser';


const VerifyOtp = () => {
  const [savedId, setSavedId] = useState("");
  const {navigate} = useEssentials()

  useEffect(() => {
    const Id = localStorage.getItem("registeredUserId");
    if (Id !== null) {
      setSavedId(Id);
    } else {
      navigate(-1);
    }
    return () => {
      localStorage.removeItem("registeredUserId");
    }
  }, []);
  return (
    <VerifyUser savedId={savedId}/>
  )
}

export default VerifyOtp