import { createSlice } from '@reduxjs/toolkit';
import { admin } from '../../api';

const initialState = {
  users: [],
  roles: [],
  systemLogs: [],
  loading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchAdminDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAdminDataSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload.users || [];
      state.roles = action.payload.roles || [];
      state.systemLogs = action.payload.logs || [];
      state.error = null;
    },
    fetchAdminDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    managementActionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    managementActionSuccess: (state, action) => {
      state.loading = false;
      
      // 根据操作类型更新状态
      if (action.payload.type === 'ADD_USER') {
        state.users.push(action.payload.data);
      } else if (action.payload.type === 'UPDATE_USER') {
        const index = state.users.findIndex(user => user.id === action.payload.data.id);
        if (index !== -1) {
          state.users[index] = action.payload.data;
        }
      } else if (action.payload.type === 'DELETE_USER') {
        state.users = state.users.filter(user => user.id !== action.payload.data.id);
      }
      
      state.error = null;
    },
    managementActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchAdminDataStart,
  fetchAdminDataSuccess,
  fetchAdminDataFailure,
  managementActionStart,
  managementActionSuccess,
  managementActionFailure
} = adminSlice.actions;

// 获取管理员数据
export const fetchAdminData = () => async (dispatch) => {
  dispatch(fetchAdminDataStart());
  try {
    const [users, roles, logs] = await Promise.all([
      admin.getUsers(),
      admin.getRoles(),
      admin.getSystemLogs()
    ]);
    
    dispatch(fetchAdminDataSuccess({
      users,
      roles,
      logs
    }));
  } catch (error) {
    dispatch(fetchAdminDataFailure(error.message));
  }
};

// 添加用户
export const addUser = (userData) => async (dispatch) => {
  dispatch(managementActionStart());
  try {
    const response = await admin.addUser(userData);
    if (response.success) {
      dispatch(managementActionSuccess({
        type: 'ADD_USER',
        data: response.data
      }));
      return true;
    } else {
      dispatch(managementActionFailure(response.error || '添加用户失败'));
      return false;
    }
  } catch (error) {
    dispatch(managementActionFailure(error.message));
    return false;
  }
};

// 更新用户
export const updateUser = (userData) => async (dispatch) => {
  dispatch(managementActionStart());
  try {
    const response = await admin.updateUser(userData);
    if (response.success) {
      dispatch(managementActionSuccess({
        type: 'UPDATE_USER',
        data: response.data
      }));
      return true;
    } else {
      dispatch(managementActionFailure(response.error || '更新用户失败'));
      return false;
    }
  } catch (error) {
    dispatch(managementActionFailure(error.message));
    return false;
  }
};

// 删除用户
export const deleteUser = (userId) => async (dispatch) => {
  dispatch(managementActionStart());
  try {
    const response = await admin.deleteUser(userId);
    if (response.success) {
      dispatch(managementActionSuccess({
        type: 'DELETE_USER',
        data: { id: userId }
      }));
      return true;
    } else {
      dispatch(managementActionFailure(response.error || '删除用户失败'));
      return false;
    }
  } catch (error) {
    dispatch(managementActionFailure(error.message));
    return false;
  }
};

export default adminSlice.reducer; 