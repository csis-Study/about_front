import { createSlice } from '@reduxjs/toolkit';
import { auth } from '../../api';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // 设置 localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', action.payload.user.role);
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      
      // 清除 localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      
      // 清除 localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// 登录 action
export const login = (username, password, role) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await auth.login(username, password);
    if (response.success) {
      // 验证用户角色是否匹配
      if (response.data.role !== role) {
        dispatch(loginFailure('用户角色不匹配'));
        return false;
      }
      
      // 设置用户数据，包括角色
      const userData = {
        ...response.data,
        role: role  // 确保角色与登录时选择的一致
      };
      
      dispatch(loginSuccess({
        user: userData,
        token: response.data.token
      }));
      
      return true;
    } else {
      dispatch(loginFailure(response.error || '登录失败'));
      return false;
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
    return false;
  }
};

export default authSlice.reducer; 