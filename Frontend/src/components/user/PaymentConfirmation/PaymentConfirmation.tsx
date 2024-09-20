import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, CreditCard, Calendar } from 'lucide-react'
import { Button } from "../../ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card"
import { useEssentials } from '../../../hooks/UseEssentials'
import { useParams } from 'react-router-dom'

interface PaymentResultProps {
  isSuccessful: boolean
  amount: number
  date: string
  driver: string
  destination: string
}

export default function PaymentStatus({ isSuccessful = true, amount = 25.00, date = "2023-06-15", destination = "Downtown" }: PaymentResultProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const {navigate} = useEssentials();
  const { rideId } = useParams();

  useEffect(() => {
    if (isSuccessful) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isSuccessful])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isSuccessful ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccessful ? "Your carpooling ride is confirmed." : "There was an issue processing your payment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center"
          >
            {isSuccessful ? (
              <CheckCircle className="w-24 h-24 text-green-500" />
            ) : (
              <XCircle className="w-24 h-24 text-red-500" />
            )}
          </motion.div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center"><CreditCard className="mr-2" /> Amount:</span>
              <span className="font-semibold">₹{amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center"><Calendar className="mr-2" /> Date:</span>
              <span>{date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Destination:</span>
              <span>{destination}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={()=>navigate(`/user/rideDetails/${rideId}`)} variant={isSuccessful ? "default" : "destructive"}>
            {isSuccessful ? "View Ride Details" : "Try Again"}
          </Button>
        </CardFooter>
      </Card>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                opacity: 1
              }}
              animate={{
                y: window.innerHeight + 10,
                opacity: 0
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}