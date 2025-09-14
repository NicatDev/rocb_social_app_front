import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import styles from "./style.module.scss";
import API from "@/api"; // Your API folder
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await API.Users.register(values); // API call
      console.log(response.data);

      message.success("Registration successful! Please login.");
      navigate("/login"); 
    } catch (error) {
      console.error(error);
      message.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.registerBox}>
        <div className={styles.registerTitle}>Register</div>
        <Form
          name="registerForm"
          onFinish={onFinish}
          className={styles.registerForm}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Passwords do not match!");
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.registerButton}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;