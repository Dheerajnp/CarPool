import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './userStore/Authentication/AuthSlice'
import adminAuthReducer from './adminStore/Authentication/AdminAuthSlice'
import driverReducer from './driverStore/DriverSlice'
import { AuthState } from './userStore/Authentication/interfaces';
import { AdminAuthState } from './adminStore/Authentication/interfaces';
import { DriverStoreState } from './driverStore/interfaces';

interface RootReducerInterface {
    auth: AuthState;
    authAdmin:AdminAuthState;
    driver:DriverStoreState;
  }



const rootReducer:Reducer<RootReducerInterface> = combineReducers({
    auth:authReducer,
    authAdmin:adminAuthReducer,
    driver: driverReducer,  // Add your driver store here
})

const persistConfig = {
  key: "root",
  storage,
  version: 1,
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