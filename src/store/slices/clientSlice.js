import { createSlice } from '@reduxjs/toolkit';
import { client } from '../../api';

const initialState = {
  clientInfo: null,
  loading: false,
  error: null
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    fetchClientInfoStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchClientInfoSuccess: (state, action) => {
      state.loading = false;
      state.clientInfo = action.payload;
      state.error = null;
    },
    fetchClientInfoFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateClientInfoStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateClientInfoSuccess: (state, action) => {
      state.loading = false;
      state.clientInfo = action.payload;
      state.error = null;
    },
    updateClientInfoFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchClientInfoStart,
  fetchClientInfoSuccess,
  fetchClientInfoFailure,
  updateClientInfoStart,
  updateClientInfoSuccess,
  updateClientInfoFailure
} = clientSlice.actions;

// 获取客户信息
export const fetchClientInfo = (clientId) => async (dispatch) => {
  dispatch(fetchClientInfoStart());
  try {
    const response = await client.getClientInfo(clientId);
    dispatch(fetchClientInfoSuccess(response));
  } catch (error) {
    dispatch(fetchClientInfoFailure(error.message));
  }
};

// 更新客户信息
export const updateClientInfo = (clientData) => async (dispatch) => {
  dispatch(updateClientInfoStart());
  try {
    const response = await client.updateClientInfo(clientData);
    if (response.success) {
      dispatch(updateClientInfoSuccess(response.data));
      return true;
    } else {
      dispatch(updateClientInfoFailure(response.error || '更新客户信息失败'));
      return false;
    }
  } catch (error) {
    dispatch(updateClientInfoFailure(error.message));
    return false;
  }
};

export default clientSlice.reducer; 