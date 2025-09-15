import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Input,
  Typography,
  Modal,
  message,
  Image,
} from "antd";
import {
  UserOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  InstagramOutlined,
  FileOutlined,
} from "@ant-design/icons";
import axios from "axios";
import styles from "./style.module.scss";
import CreatePost from "./components/CreatePost";

const { Title, Text } = Typography;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const fetchPosts = async (
    url = "http://46.62.145.90:500/api/content/posts/"
  ) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      message.error("You are not logged in!");
      return;
    }

    try {
      if (posts.length > 0) setLoadingMore(true);
      else setLoading(true);

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setPosts((prev) => [...prev, ...data.results]);
      setNextPageUrl(data.next);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch posts!");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const afterChange = () => {
    setPosts([])
       fetchPosts();
  }

  const handleFileClick = (fileUrl) => setFilePreview(fileUrl);

  const truncateContent = (content, length = 100) => {
    if (!content) return "";
    return content.length > length ? content.slice(0, length) + "..." : content;
  };

  return (
    <div className={styles.feedWrapper}>
      {/* Left Sidebar */}
      <div className={styles.sidebarLeft}>
        <Card className={styles.userCard}>
          <Avatar size={64} icon={<UserOutlined />} />
          <Title level={4} style={{ marginTop: 8, marginBottom: 4 }}>
            John Doe
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Frontend Developer
          </Text>
          <Button type="primary" style={{ marginTop: 8 }}>
            Follow
          </Button>
        </Card>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <CreatePost afterChange={afterChange} />
        {posts?.map((post) => (
          <Card
            key={post.id}
            className={styles.postCard}
            title={<Text strong>{post.user}</Text>}
            extra={
              <Text type="secondary">
                {new Date(post.created_date).toLocaleString()}
              </Text>
            }
            loading={loading}
            actions={[
              <div className={styles?.commentDiv}>
                <Input
                  placeholder="Write a comment..."
                  className={styles.commentInput}
                />
              </div>,
            ]}
            // footer olaraq comment sahəsi
          >
            <Text>
              {truncateContent(post.content)}
              {post.content && post.content.length > 100 && (
                <Button type="link" onClick={() => message.info(post.content)}>
                  View More
                </Button>
              )}
            </Text>

            {/* Media */}
            {post.image && (
              <div className={styles.imageWrapper}>
                <Image
                  src={post.image}
                  alt="Post media"
                  className={styles.media}
                />
              </div>
            )}

            {/* File */}
            {post.file && (
              <div className={styles.fileWrapper}>
                <Button
                  icon={<FileOutlined />}
                  onClick={() => handleFileClick(post.file)}
                  className={styles.fileButton}
                >
                  {post.file.split("/").pop()}
                </Button>
              </div>
            )}
          </Card>
        ))}

        {/* Load More */}
        {nextPageUrl && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button
              onClick={() => fetchPosts(nextPageUrl)}
              loading={loadingMore}
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className={styles.sidebarRight}>
        <Card className={styles.socialCard}>
          <Title
            level={5}
            style={{ marginBottom: 15, marginTop: 2, textAlign: "center" }}
          >
            Social Media
          </Title>
          <div className={styles.socialLinks}>
            <Button shape="circle" icon={<InstagramOutlined />} />
            <Button shape="circle" icon={<LinkedinOutlined />} />
            <Button shape="circle" icon={<TwitterOutlined />} />
          </div>
        </Card>
      </div>

      {/* File preview modal */}
      <Modal
        open={!!filePreview}
        title="File Preview"
        footer={null}
        onCancel={() => setFilePreview(null)}
      >
        {filePreview && (
          <iframe
            src={filePreview}
            title="File Preview"
            style={{ width: "100%", height: "80vh" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Home;
