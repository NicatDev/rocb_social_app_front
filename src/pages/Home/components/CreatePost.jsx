import React, { useState } from "react"; 
import {
  Card,
  Input,
  Button,
  Upload,
  message,
  Divider,
  Space,
  Modal,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import fileIcon from "@/assets/file.png";
import mediaIcon from "@/assets/media.png";
import styles from "./style.module.scss";
import { App as AntdApp } from "antd";

const { TextArea } = Input;

const CreatePost = ({ afterChange }) => {
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const { message } = AntdApp.useApp();

  const handlePreview = async (file) => {
    let src = file.url || file.preview;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setPreviewImage(src);
    setPreviewTitle(file.name);
    setPreviewOpen(true);
  };

  const truncateFileName = (name) =>
    name.length > 10 ? name.slice(0, 10) + "..." : name;

  const handlePost = async () => {
    if (!content && fileList.length === 0 && imageList.length === 0) {
      message.error("Please add content or a file/photo.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);

    if (fileList.length > 0) formData.append("file", fileList[0].originFileObj);
    if (imageList.length > 0)
      formData.append("image", imageList[0].originFileObj);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("You are not logged in!");
        return;
      }
      setLoading(true);
      const { data } = await axios.post(
        "http://46.62.145.90:500/api/content/posts/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      message.success("Post created successfully!");
      setContent("");
      setFileList([]);
      setImageList([]);
      afterChange();
    } catch (error) {
      console.error(error);
      if (error.response?.data) {
        const data = error.response.data;
        const errors = Object.entries(data)
          .map(([field, msgs]) => {
            const messages = Array.isArray(msgs) ? msgs.join(", ") : msgs;
            return `${field}: ${messages}`;
          })
          .join("\n");
        message.error(errors || "Failed to create post!");
      } else {
        message.error("Failed to create post!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.createPost}>
      <TextArea
        placeholder="What do you want to talk about?"
        autoSize={{ minRows: 3, maxRows: 6 }}
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Divider className={styles.divider} />

      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Space style={{ gap: 12, flexWrap: "wrap" }}>
          <Upload
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
              renderItem: (file) => ({ ...file, name: truncateFileName(file.name) }),
            }}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
            onPreview={handlePreview}
          >
            <Button className={styles.UploadIcon} icon={<img src={fileIcon} alt="File" />}>
              File
            </Button>
          </Upload>

          <Upload
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
              renderItem: (file) => ({ ...file, name: truncateFileName(file.name) }),
            }}
            beforeUpload={() => false}
            fileList={imageList}
            onChange={({ fileList }) => setImageList(fileList)}
            maxCount={1}
            onPreview={handlePreview}
          >
            <Button className={styles.UploadIcon} icon={<img src={mediaIcon} alt="Media" />}>
              Photo
            </Button>
          </Upload>
        </Space>

        <Button
          type="primary"
          icon={<SendOutlined />}
          className={styles.postButton}
          onClick={handlePost}
          loading={loading}
        >
          Post
        </Button>
      </Space>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Card>
  );
};

export default CreatePost;
