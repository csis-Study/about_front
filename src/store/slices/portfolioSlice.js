import { createSlice } from '@reduxjs/toolkit';
import { portfolio } from '../../api';

const initialState = {
  portfolioData: null,
  loading: false,
  error: null
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    fetchPortfolioStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPortfolioSuccess: (state, action) => {
      state.loading = false;
      state.portfolioData = action.payload;
      state.error = null;
    },
    fetchPortfolioFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatePortfolioStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePortfolioSuccess: (state, action) => {
      state.loading = false;
      state.portfolioData = action.payload;
      state.error = null;
    },
    updatePortfolioFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchPortfolioStart,
  fetchPortfolioSuccess,
  fetchPortfolioFailure,
  updatePortfolioStart,
  updatePortfolioSuccess,
  updatePortfolioFailure
} = portfolioSlice.actions;

// 获取投资组合数据
export const fetchPortfolio = (clientId) => async (dispatch) => {
  dispatch(fetchPortfolioStart());
  try {
    const response = await portfolio.getPortfolio(clientId);
    dispatch(fetchPortfolioSuccess(response));
  } catch (error) {
    dispatch(fetchPortfolioFailure(error.message));
  }
};

// 更新投资组合数据
export const updatePortfolio = (portfolioData) => async (dispatch) => {
  dispatch(updatePortfolioStart());
  try {
    const response = await portfolio.updatePortfolio(portfolioData);
    if (response.success) {
      dispatch(updatePortfolioSuccess(response.data));
      return true;
    } else {
      dispatch(updatePortfolioFailure(response.error || '更新投资组合失败'));
      return false;
    }
  } catch (error) {
    dispatch(updatePortfolioFailure(error.message));
    return false;
  }
};

export default portfolioSlice.reducer; 