import { createSlice } from '@reduxjs/toolkit';
import { compliance } from '../../api';

const initialState = {
  compliancePolicies: [],
  pendingApprovals: [],
  auditReports: [],
  loading: false,
  error: null
};

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    fetchComplianceDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchComplianceDataSuccess: (state, action) => {
      state.loading = false;
      state.compliancePolicies = action.payload.policies || [];
      state.pendingApprovals = action.payload.approvals || [];
      state.auditReports = action.payload.reports || [];
      state.error = null;
    },
    fetchComplianceDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    processApprovalStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    processApprovalSuccess: (state, action) => {
      state.loading = false;
      state.pendingApprovals = state.pendingApprovals.filter(
        item => item.id !== action.payload.id
      );
      state.error = null;
    },
    processApprovalFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchComplianceDataStart,
  fetchComplianceDataSuccess,
  fetchComplianceDataFailure,
  processApprovalStart,
  processApprovalSuccess,
  processApprovalFailure
} = complianceSlice.actions;

// 获取合规数据
export const fetchComplianceData = () => async (dispatch) => {
  dispatch(fetchComplianceDataStart());
  try {
    const [policies, approvals, reports] = await Promise.all([
      compliance.getPolicies(),
      compliance.getPendingApprovals(),
      compliance.getAuditReports()
    ]);
    
    dispatch(fetchComplianceDataSuccess({
      policies,
      approvals,
      reports
    }));
  } catch (error) {
    dispatch(fetchComplianceDataFailure(error.message));
  }
};

// 处理审批
export const processApproval = (approvalId, isApproved, reason) => async (dispatch) => {
  dispatch(processApprovalStart());
  try {
    const response = await compliance.processApproval(approvalId, isApproved, reason);
    if (response.success) {
      dispatch(processApprovalSuccess({ id: approvalId }));
      return true;
    } else {
      dispatch(processApprovalFailure(response.error || '处理审批失败'));
      return false;
    }
  } catch (error) {
    dispatch(processApprovalFailure(error.message));
    return false;
  }
};

export default complianceSlice.reducer; 