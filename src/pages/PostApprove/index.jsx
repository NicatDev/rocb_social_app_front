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
  Pagination,
} from "antd";
import {
  FileOutlined,
  CheckOutlined,
  CloseOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import axiosInstance from "@/config/Axios";
import styles from "./style.module.scss";

const { Text } = Typography;

const PostApprovePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const showImageModal = (src) => {
    setSelectedImage(src);
    setImageModalVisible(true);
  };

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/content/posts/?is_active=null&page=${pageNum}`
      );

      setPosts(data.results || []);
      setTotal(data.count || 0);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch posts!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleAction = async (id, action) => {
    try {
      await axiosInstance.patch(`/content/posts/${id}/`, {
        is_active: action === "approve",
      });
      message.success(
        action === "approve" ? "Post approved!" : "Post rejected!"
      );
      fetchPosts(page);
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
        <>
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
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    <div className={styles.postInfo}>
                      <Text className="postUser">
                        {post.user} {post.id}
                      </Text>
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
                          }}
                        >
                          <ReadOutlined />
                        </a>
                      </Tooltip>
                    </div>
                    <div className={styles.buttonDiv}>
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
                      </Popconfirm>
                    </div>
                  </div>
                </List.Item>
              </div>
            )}
          />

          {/* ✅ Pagination */}
          <div className={styles?.paginationDiv}>
          <Pagination
            current={page}
            total={total}
            pageSize={6}
            onChange={(value) => setPage(value)}
            style={{ textAlign: "center", marginTop: 20 }}
          /></div>
        </>
      )}

      {/* Content Modal */}
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