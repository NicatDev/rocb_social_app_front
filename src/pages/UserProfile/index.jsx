import { useEffect, useState } from "react";
import {
  Card,
  Spin,
  Avatar,
  Tabs,
  Row,
  Col,
  Button,
  App as AntdApp,
} from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../Profile/style.module.scss";
import Post from "../../components/ui/Post";

const PublicProfilePage = () => {
  const { username } = useParams(); // URL-dən id götürürük
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const { message } = AntdApp.useApp();


  const fetchProfile = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        `http://46.62.145.90:500/api/account/user/${username}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setProfile(res.data);
    } catch (err) {
      message.error("Failed to fetch profile",err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (url) => {
    if (!url) return;
    setPostsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPosts((prev) => [...prev, ...(res?.data?.results || [])]);
        setNextPageUrl(res?.data?.next || null);

    } catch (err) {
      message.error("Failed to fetch posts",err);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if(username)fetchProfile();
  }, [username]);
  

  useEffect(() => {
    if(profile?.id)fetchPosts(`http://46.62.145.90:500/api/content/posts/?user=${profile.id}`);
  }, [profile]);

  if (loading || !profile)
    return <Spin size="large" className={styles.spinner} />;

  const tabsItems = [
    {
      key: "1",
      label: "Profile Information",
      children: (
        <div>
          <Row gutter={[16, 12]}>
            {[
              { label: "Email", key: "email" },
              { label: "First Name", key: "first_name" },
              { label: "Last Name", key: "last_name" },
              { label: "Phone", key: "phone_number" },
              { label: "Birth Date", key: "birth_date" },
              { label: "Country", key: "country" },
              { label: "Organization", key: "organization" },
              { label: "Position", key: "position" },
              { label: "Profile Views", key: "view_count" },
            ].map((field) => (
              <Col xs={24} sm={12} key={field.key}>
                <label>{field.label}</label>
                <Card size="small" className={styles.infoCard}>
                  {profile[field.key] || "-"}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
    {
      key: "2",
      label: "Posts",
      children:
        postsLoading && posts.length === 0 ? (
          <Spin size="large" />
        ) : (
          <div className={styles.mainContent}>
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
            {nextPageUrl && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Button
                  onClick={() => fetchPosts(nextPageUrl)}
                  loading={postsLoading}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        ),
    },
  ];

  return (
    <div className={styles?.main}>
      <div className={styles.profileContainer}>
        <div className={styles.sidebar}>
          <Card className={styles.profileCard}>
            <div className={styles.avatarContainer}>
            
              <Avatar
                src={profile?.profile_picture}
                size={100}
              />
            </div>
            <h2>
              {profile?.first_name} {profile?.last_name}
            </h2>
          </Card>
        </div>

        <div className={styles.content}>
          <Card className={styles.tabCard}>
            <Tabs defaultActiveKey="1" items={tabsItems} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
