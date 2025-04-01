import React, { useState } from "react";
import axios from "axios";
import { Button, Checkbox, Form, Input, message, Select, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

const { Title } = Typography;
const { Option } = Select;

const LoginSystem = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = debounce((e) => {
    setUsername(e.target.value);
  }, 300);

  const handlePasswordChange = debounce((e) => {
    setPassword(e.target.value);
  }, 300);

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:9001/api/login", {
        username,
        password,
        role,
      });
      console.log("response", response);

      if (response.status === 200) {
        const { code, data } = response.data;
        if (code === 200) {
          const { token, role } = data;
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          console.log("data", data);

          message.success("登录成功！");

          switch (role) {
            case "advisor":
              navigate("/advisor");
              break;
            case "risk":
              navigate("/risk-officer");
              break;
            case "approval":
              navigate("/compliance-officer");
              break;
            case "admin":
              navigate("/admin");
              break;
            default:
              navigate("/clients");
          }
        } else {
          clearLocalStorage();
          message.error("登录失败，请检查账号和密码！");
        }
      } else {
        clearLocalStorage();
        message.error("登录失败，请检查账号和密码！");
      }
    } catch (error) {
      clearLocalStorage();
      if (error.response) {
        message.error(
          `登录失败: ${error.response.data.message || "服务器返回错误"}`
        );
      } else if (error.request) {
        message.error("登录失败: 没有收到服务器响应");
      } else {
        message.error(`登录失败: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const validatePassword = (rule, value) => {
    if (!value) {
      return Promise.reject("请输入密码!");
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(value)) {
      return Promise.reject(
        "密码必须至少包含8个字符，包括大写字母、小写字母和数字!"
      );
    }
    return Promise.resolve();
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <div className="login-container">
      <Title level={2} className="login-title">
        系统人员登录入口
      </Title>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="login-form"
      >
        <Form.Item
          label="账号"
          name="username"
          rules={[{ required: true, message: "请输入你的账号!" }]}
          className="login-form-item"
        >
          <Input onChange={handleUsernameChange} placeholder="请输入账号" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, validator: validatePassword }]}
          className="login-form-item"
        >
          <Input.Password
            onChange={handlePasswordChange}
            placeholder="请输入密码"
          />
        </Form.Item>

        {/* 新增角色选择框 */}
        <Form.Item
          label="角色"
          name="role"
          rules={[{ required: true, message: "请选择你的角色!" }]}
          className="login-form-item"
        >
          <Select onChange={handleRoleChange} placeholder="请选择角色">
            <Option value="advisor">客户经理</Option>
            <Option value="risk">风控专员</Option>
            <Option value="approval">合规专员</Option>
            <Option value="admin">系统管理员</Option>
          </Select>
        </Form.Item>

        <div className="bottom-desc">
          <Form.Item
            name="remember"
            valuePropName="checked"
            label={null}
            className="login-form-item"
          >
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="/client-login">
            前往客户登录
          </a>
        </div>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            className="login-button"
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginSystem;
