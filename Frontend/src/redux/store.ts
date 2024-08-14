import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './userStore/Authentication/AuthSlice'
import adminAuthReducer from './adminStore/Authentication/AdminAuthSlice'
import driverReducer from './driverStore/DriverSlice'
import rideReducer ,{RideState} from './rideStore/rideSlice'
import { AuthState } from './userStore/Authentication/interfaces';
import { AdminAuthState } from './adminStore/Authentication/interfaces';
import { DriverStoreState } from './driverStore/interfaces';
import rideListReducer,{ RideListState } from './userStore/Rides/RideListSlice';
import { RideDetailsListState } from './userStore/RideDetails/RideDetailsInterface';
import  rideDetailsReducer  from './userStore/RideDetails/RideDetailsSlice'

interface RootReducerInterface {
    auth: AuthState;
    authAdmin:AdminAuthState;
    driver:DriverStoreState;
    ride:RideState;
    rides:RideListState;
    rideDetails:RideDetailsListState;
  }



const rootReducer:Reducer<RootReducerInterface> = combineReducers({
    auth:authReducer,
    authAdmin:adminAuthReducer,
    driver: driverReducer, 
    ride: rideReducer,  
    rides:rideListReducer,
    rideDetails:rideDetailsReducer
})

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["ride","rideDetails"],
};

const persistedReducer = persistReducer(persistConfig,rootReducer)


export type AppDispatch = typeof store.dispatch;


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  }); 

  export const persistor = persistStore(store);
  export default store;

  export type RootState =  ReturnType<typeof store.getState>;