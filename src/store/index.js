import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientReducer from './slices/clientSlice';
import portfolioReducer from './slices/portfolioSlice';
import riskReducer from './slices/riskSlice';
import complianceReducer from './slices/complianceSlice';
import adminReducer from './slices/adminSlice';
import tradeReducer from './slices/tradeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    portfolio: portfolioReducer,
    risk: riskReducer,
    compliance: complianceReducer,
    admin: adminReducer,
    trade: tradeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
export default store; 