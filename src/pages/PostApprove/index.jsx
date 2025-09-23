import React, { useEffect, useState } from "react";
import {
  List,
  Avatar,
  Typography,
  Tooltip,
  Button,
  Spin,
  message,
  Popconfirm,
  Modal,
} from "antd";
import {
  FileOutlined,
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import styles from "./style.module.scss";

const { Text, Title } = Typography;

const PostApprovePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const showImageModal = (src) => {
    setSelectedImage(src);
    setImageModalVisible(true);
  };
  const fetchPosts = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://46.62.145.90:500/api/content/posts/?is_active=null",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(data.results || []);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch posts!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        `http://46.62.145.90:500/api/content/posts/${id}/`,
        { is_active: action === "approve" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        action === "approve" ? "Post approved!" : "Post rejected!"
      );
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      message.error("Failed to update post status!");
    }
  };

  const showContentModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <div className={styles.approvePage}>
      {loading ? (
        <div className={styles.spinner}>
          <Spin size="large" />
        </div>
      ) : posts.length === 0 ? (
        <Text type="secondary" className={styles.emptyText}>
          No pending posts 🎉
        </Text>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={posts}
          renderItem={(post) => (
            <div key={post.id}>
              <List.Item className={styles.postItem}>
                <div className={styles.contentWrapper}>
                  {post.image && (
                    <Avatar
                      src={post.image}
                      shape="square"
                      size={64}
                      className={styles.avatar}
                      onClick={() => showImageModal(post.image)}
                      style={{ cursor: "pointer" }} // kliklənə bilsin deyə
                    /> 
                  
                  )}
                  <div className={styles.postInfo}>
                    <Text className="postUser">{post.user}   {post.id}</Text>
                    <Text className="postCreated">
                      {new Date(post.created_date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </div>
                </div>

                <div className={styles.actions}>
                  <div className={styles.buttonDiv}>
                    {" "}
                    {post.file && (
                      <Tooltip title="Open file">
                        <a
                          href={post.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileOutlined className={styles.fileIcon} />
                        </a>
                      </Tooltip>
                    )}
                    <Tooltip title="Read content">
                      <a
                        onClick={() => showContentModal(post.content)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          color: "#12579e",
                          cursor: "pointer",
                          transition: "color 0.2s ease",
                        }}
                      >
                        <ReadOutlined />
                      </a>
                    </Tooltip>
                  </div>
                  <div className={styles.buttonDiv}>
                    {" "}
                    <Popconfirm
                      title="Reject this post?"
                      onConfirm={() => handleAction(post.id, "reject")}
                    >
                      <Button danger shape="circle" icon={<CloseOutlined />} />
                    </Popconfirm>
                    <Popconfirm
                      title="Approve this post?"
                      onConfirm={() => handleAction(post.id, "approve")}
                    >
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<CheckOutlined />}
                      />
                    </Popconfirm>{" "}
                  </div>
                </div>
              </List.Item>
            </div>
          )}
        />
      )}

      {/* Modal */}
      <Modal
        title="Post Content"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 600 }}
      >
        <div
          className={styles.Modal}
          dangerouslySetInnerHTML={{ __html: modalContent }}
          style={{ whiteSpace: "pre-wrap" }}
        />
      </Modal>
      {/* Image Modal */}
      <Modal
        open={imageModalVisible}
        footer={null}
        onCancel={() => setImageModalVisible(false)}
        width="90%"
        style={{ maxWidth: "700px", textAlign: "center" }}
      >
        <img
          src={selectedImage}
          alt="Post"
          style={{
            maxWidth: "100%",
            maxHeight: "80vh",
            borderRadius: "10px",
            objectFit: "contain",
          }}
        />
      </Modal>
    </div>
  );
};

export default PostApprovePage;
