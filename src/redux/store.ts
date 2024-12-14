import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import recentProductReducer from "./features/recentProducts/recentProducts.slice";
import couponReducer from "./features/cupon/cupon.slice";
import comparisonReducer from "./features/product/product.slice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";

const persistConfig = {
  key: "auth",
  storage,
};

const recentProductConfig = {
  key: "recentProduct",
  storage,
};

const couponConfig = {
  key: "coupon",
  storage,
};

const comparisonConfig = {
  key: "comparison",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);
const persistedCouponReducer = persistReducer(couponConfig, couponReducer);
const persistRecentReducer = persistReducer(
  recentProductConfig,
  recentProductReducer
);
const persistComparisonReducer = persistReducer(
  comparisonConfig,
  comparisonReducer
);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedReducer,
    recentProduct: persistRecentReducer,
    coupon: persistedCouponReducer,
    comparison: persistComparisonReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
