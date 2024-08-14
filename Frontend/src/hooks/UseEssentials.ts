
import { useDispatch, useSelector,shallowEqual } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { AuthState } from '../redux/userStore/Authentication/interfaces';
import { toast } from 'react-hot-toast'
import {  useMemo, } from 'react';
import { AdminAuthState } from '../redux/adminStore/Authentication/interfaces';
import { RideState } from '../redux/rideStore/rideSlice';
import { DriverStoreState } from '../redux/driverStore/interfaces';
import { RideDetailsListState } from '../redux/userStore/RideDetails/RideDetailsInterface';

interface RootReducerInterface {
    navigate: NavigateFunction;
    dispatch: AppDispatch;
    auth: AuthState;
    authAdmin:AdminAuthState;
    ride: RideState;
    driver: DriverStoreState;
    rideDetails: RideDetailsListState
}



export const useEssentials = (): RootReducerInterface => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { auth,authAdmin,ride,driver,rideDetails } = useSelector(
        (state: RootState) => ({
            auth: state.auth,
            authAdmin:state.authAdmin,
            driver: state.driver,
            ride: state.ride,
            rideDetails:state.rideDetails,
        }),
        shallowEqual
    );

    return useMemo(() => ({
        dispatch,
        navigate,
        auth,
        authAdmin,
        ride,
        driver,
        rideDetails
    }), [dispatch, navigate, auth, authAdmin, ride, driver,rideDetails]);
};




export type toastType = 'success' | 'error';

export const useToast: Function = (message: string, name: toastType) => {
    return toast[name](message, {
        duration: 1500,
        position: 'top-right'
    })
}