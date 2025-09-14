import { useState } from "react";
import { Form, Input, Button } from "antd";
import { App as AntdApp } from "antd";
import styles from "./style.module.scss";
import API from "@/api";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/ui";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp(); 

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await API.Account.login(values);
      if (response.data.access_token) {
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
      }
      message.success("Login successful!");
      navigate("/");
    } catch (error) {
      message.error(error.response.data.detail); // Artıq işləməlidir
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>Login</div>
        <Form
          name="loginForm"
          onFinish={onFinish}
          className={styles.loginForm}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginButton}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
