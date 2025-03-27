// 以 loginUser.jsx 为例，loginSystem.jsx 类似
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Checkbox, Form, Input, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

const { Title } = Typography;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const role = "client";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = debounce((e) => {
    setUsername(e.target.value);
  }, 300);

  const handlePasswordChange = debounce((e) => {
    setPassword(e.target.value);
  }, 300);

  const onFinish = async (values) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:9001/api/login", {
        username,
        password,
        role
      });
      console.log("response.data", response.data);

      if (response.data.code === 200) {
        const { token, role, userInfo } = response.data.data;
        console.log('userInfo',userInfo);
        
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        message.success("登录成功！");
        navigate("/clients");
      } else {
        clearLocalStorage();
        setError("登录失败，请检查账号和密码！");
      }
    } catch (error) {
      clearLocalStorage();
      if (error.response) {
        setError(`登录失败: ${error.response.data.message || "服务器返回错误"}`);
      } else if (error.request) {
        setError("登录失败: 没有收到服务器响应");
      } else {
        setError(`登录失败: ${error.message}`);
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
      return Promise.reject("密码必须至少包含8个字符，包括大写字母、小写字母和数字!");
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
        客户登录入口
      </Title>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="login-form login-form-user"
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

        <div className="bottom-desc">
          <Form.Item
            name="remember"
            valuePropName="checked"
            label={null}
            className="login-form-item"
          >
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="/system-login">
            前往系统人员登录
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

export default Login;