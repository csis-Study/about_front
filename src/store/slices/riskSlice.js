import { createSlice } from '@reduxjs/toolkit';
import { risk } from '../../api';

const initialState = {
  riskData: null,
  loading: false,
  error: null
};

const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {
    fetchRiskDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRiskDataSuccess: (state, action) => {
      state.loading = false;
      state.riskData = action.payload;
      state.error = null;
    },
    fetchRiskDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateRiskProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateRiskProfileSuccess: (state, action) => {
      state.loading = false;
      state.riskData = {
        ...state.riskData,
        riskProfile: action.payload
      };
      state.error = null;
    },
    updateRiskProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchRiskDataStart,
  fetchRiskDataSuccess,
  fetchRiskDataFailure,
  updateRiskProfileStart,
  updateRiskProfileSuccess,
  updateRiskProfileFailure
} = riskSlice.actions;

// 获取风险分析数据
export const fetchRiskAnalysis = (clientId) => async (dispatch) => {
  dispatch(fetchRiskDataStart());
  try {
    const response = await risk.getRiskAnalysis(clientId);
    dispatch(fetchRiskDataSuccess(response));
  } catch (error) {
    dispatch(fetchRiskDataFailure(error.message));
  }
};

// 更新风险偏好
export const updateRiskProfile = (clientId, profileData) => async (dispatch) => {
  dispatch(updateRiskProfileStart());
  try {
    const response = await risk.updateRiskProfile(clientId, profileData);
    if (response.success) {
      dispatch(updateRiskProfileSuccess(response.data));
      return true;
    } else {
      dispatch(updateRiskProfileFailure(response.error || '更新风险偏好失败'));
      return false;
    }
  } catch (error) {
    dispatch(updateRiskProfileFailure(error.message));
    return false;
  }
};

export default riskSlice.reducer; 