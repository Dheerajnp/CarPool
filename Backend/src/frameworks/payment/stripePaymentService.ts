import Stripe from 'stripe'
import {configuredKeys} from '../../config/config'

const stripe = new Stripe(configuredKeys.STRIPE_SECRET_KEY);

type userData = {
    name:string,
    email:string
}

export const createPaymentIntent = async(userData:userData, totalAmount: number , rideId:string) => {
    try {
        
        const user = await stripe.customers.create({
            name:userData.name,
            email:userData.email
        });
        console.log(user)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Ride',
                        description: `Ride Id: ${rideId}`,
                    },
                    unit_amount: totalAmount * 100,
                },
                quantity: 1,
            }],
            mode: "payment",
            success_url: `${configuredKeys.VITE_ORIGIN}/user/payment-status/${rideId}?success=true`,
            cancel_url: `${configuredKeys.VITE_ORIGIN}/user/payment-status/${rideId}?success=false`,
            customer: user.id,
        });
        return session;
    } catch (error) {
        throw new Error(
            `Error creating payment session: ${(error as Error).message}`
          );
    }
}