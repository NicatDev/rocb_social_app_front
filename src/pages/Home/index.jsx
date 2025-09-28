import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Typography } from "antd";
import {
  UserOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import axiosInstance from "@/config/Axios";
import styles from "./style.module.scss";
import CreatePost from "./components/CreatePost";
import Post from "../../components/ui/Post";
import { useNavigate } from "react-router-dom";
import { App as AntdApp } from "antd";
import { useAuth } from "../../context/AuthContext";

const { Title, Text } = Typography;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const { message } = AntdApp.useApp();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async (
    url = "/content/posts/"
  ) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      if (posts.length > 0) setLoadingMore(true);

      const { data } = await axiosInstance.get(url);

      setPosts((prev) => {
        const merged = [...prev, ...data.results];
        const unique = merged.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.id === post.id)
        );
        return unique;
      });
      setNextPageUrl(data.next);
    } catch (error) {
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
            <Avatar size={80} src={profile?.profile_picture} />
            <div>
              <Text type="secondary">{profile?.view_count} views</Text>
            </div>
            <Title level={4} style={{ marginTop: 8, marginBottom: 4 }}>
              {profile?.first_name} {profile?.last_name}
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {profile?.position}
            </Text>
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
