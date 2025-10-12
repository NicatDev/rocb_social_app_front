import { useState } from "react";
import { Form, Input, Button, DatePicker, Upload, Row, Col, Steps } from "antd";
import { App as AntdApp } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./style.module.scss";

const { Step } = Steps;

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();

  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values }));
      setCurrentStep((prev) => prev + 1);
      form.resetFields();
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrentStep((prev) => prev - 1);
    form.setFieldsValue(formData);
  };

  const submitForm = async () => {
    try {
      const values = await form.validateFields();
      const allData = { ...formData, ...values };

      setLoading(true);
      const formDataToSend = new FormData();

      Object.entries(allData).forEach(([key, value]) => {
        if (value) {
          if (key === "birth_date") {
            formDataToSend.append(key, value.format("YYYY-MM-DD"));
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      if (fileList.length > 0) {
        formDataToSend.append("profile_picture", fileList[0].originFileObj);
      }

      const { data } = await axios.post(
        "http://46.62.145.90:500/api/account/register/",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      message
        .success("Registration successful! Please login.")
        .then(() => navigate("/login"));
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;

        // field-specific errors array-lər şəklində gəlir
        Object.entries(errors).forEach(([field, messages]) => {
          messages.forEach((msg) => {
            console.log(msg, field);
            message.error(`${field}: ${msg}`);
          });
        });
      } else {
        message.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.registerBox}>
        <h2 className={styles.registerTitle}>Register</h2>

        {/* Steps Indicator */}
        <Steps current={currentStep} size="small" className={styles.steps}>
          <Step title="User Info" />
          <Step title="Profile Info" />
        </Steps>

        <div className={styles.scrollArea}>
          <Form form={form} layout="vertical" onFinish={submitForm}>
            <Row gutter={16}>
              {currentStep === 0 && (
                <>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter username" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { type: "email", message: "Enter a valid email!" },
                      ]}
                    >
                      <Input placeholder="Enter email" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Enter password" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Confirm Password"
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
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
                      <Input.Password placeholder="Confirm password" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="First Name" name="first_name">
                      <Input placeholder="Enter first name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Last Name" name="last_name">
                      <Input placeholder="Enter last name" />
                    </Form.Item>
                  </Col>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <Col xs={24} md={12}>
                    <Form.Item label="Phone Number" name="phone_number">
                      <Input placeholder="Enter phone number" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Birth Date" name="birth_date">
                      <DatePicker className={styles.fullWidth} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Country"
                      name="country"
                      rules={[
                        {
                          required: true,
                          message: "Please input your country!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter country" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Organization" name="organization">
                      <Input placeholder="Enter organization" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Position" name="position">
                      <Input placeholder="Enter position" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label="Profile Picture">
                      <Upload
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        maxCount={1}
                        listType="picture"
                      >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>

            {/* Step Navigation */}
            <Form.Item>
              <div className={styles.stepButtons}>
                {currentStep > 0 && (
                  <Row gutter={[11, 11]}>
                    <Col lg={8}>
                      {" "}
                      <Button onClick={prev} className={styles.prevButton}>
                        Previous
                      </Button>
                    </Col>
                    <Col lg={16}>
                      {" "}
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className={styles.registerButton}
                      >
                        Register
                      </Button>
                    </Col>
                  </Row>
                )}
                {currentStep < 1 && (
                  <Row>
                    <Col lg={24}>
                      <Button
                        className={styles.registerButton}
                        type="primary"
                        onClick={next}
                      >
                        Next
                      </Button>
                    </Col>
                  </Row>
                )}
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
