import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Typography,
  message,
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
import Post from "../../components/ui/Post";

const { Title, Text } = Typography;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
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

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setPosts((prev) => [...prev, ...data.results]);
      setNextPageUrl(data.next);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch posts!");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const afterChange = () => {
    setPosts([]);
    fetchPosts();
  };

  return (
    <div className={styles.main}>
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
        <div className={styles.mainContentWrapper}>
          <div className={styles.mainContent}>
            <CreatePost afterChange={afterChange} />
            {posts?.map((post) => (
              <Post key={post.id} post={post} />
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
      </div>
    </div>
  );
};

export default Home;
