import { createSlice } from '@reduxjs/toolkit';
import { trade } from '../../api';

const initialState = {
  transactions: [],
  loading: false,
  error: null
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.loading = false;
      state.transactions = action.payload;
      state.error = null;
    },
    fetchTransactionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    executeTradeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    executeTradeSuccess: (state, action) => {
      state.loading = false;
      state.transactions.push(action.payload);
      state.error = null;
    },
    executeTradeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    cancelTradeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    cancelTradeSuccess: (state, action) => {
      state.loading = false;
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          status: 'cancelled',
          updateTime: new Date().toISOString()
        };
      }
      state.error = null;
    },
    cancelTradeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  executeTradeStart,
  executeTradeSuccess,
  executeTradeFailure,
  cancelTradeStart,
  cancelTradeSuccess,
  cancelTradeFailure
} = tradeSlice.actions;

// 获取交易记录
export const fetchTransactions = (clientId) => async (dispatch) => {
  dispatch(fetchTransactionsStart());
  try {
    const response = await trade.getTransactions(clientId);
    dispatch(fetchTransactionsSuccess(response));
  } catch (error) {
    dispatch(fetchTransactionsFailure(error.message));
  }
};

// 执行交易
export const executeTrade = (tradeData) => async (dispatch) => {
  dispatch(executeTradeStart());
  try {
    const response = await trade.executeTrade(tradeData);
    if (response.success) {
      dispatch(executeTradeSuccess(response.data));
      return true;
    } else {
      dispatch(executeTradeFailure(response.error || '交易执行失败'));
      return false;
    }
  } catch (error) {
    dispatch(executeTradeFailure(error.message));
    return false;
  }
};

// 取消交易
export const cancelTrade = (tradeId) => async (dispatch) => {
  dispatch(cancelTradeStart());
  try {
    const response = await trade.cancelTrade(tradeId);
    if (response.success) {
      dispatch(cancelTradeSuccess({ id: tradeId }));
      return true;
    } else {
      dispatch(cancelTradeFailure(response.error || '取消交易失败'));
      return false;
    }
  } catch (error) {
    dispatch(cancelTradeFailure(error.message));
    return false;
  }
};

export default tradeSlice.reducer; 