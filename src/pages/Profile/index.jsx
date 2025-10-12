import { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Spin,
  Avatar,
  App as AntdApp,
  Tabs,
  Row,
  Col,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import axiosInstance from "@/config/Axios";
import styles from "./style.module.scss";
import Post from "../../components/ui/Post";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { profile, setProfile, fetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const { message } = AntdApp.useApp();

  const fetchPosts = async (url) => {
    if (!url) return;
    setPostsLoading(true);
    try {
      const res = await axiosInstance.get(url);
      setPosts((prev) => {
        const merged = [...prev, ...res?.data?.results];
        const unique = merged.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.id === post.id)
        );
        return unique;
      });
      setNextPageUrl(res?.data?.next);
    } catch (err) {
      message.error("Failed to fetch posts");
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts("/content/posts/?own=true");
  }, [profile]);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      await axiosInstance.patch(`/account/profile/${profile.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({ ...prev, profile_picture: e.target.result }));
      };
      reader.readAsDataURL(file);

      message.success("Profile picture updated successfully");
    } catch (err) {
      message.error("Failed to update profile picture");
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      const fields = [
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "birth_date",
        "country",
        "organization",
        "position",
      ];
      fields.forEach((field) => formData.append(field, profile[field] || ""));

      await axiosInstance.put(`/account/profile/${profile.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchProfile();
      message.success("Profile updated successfully");
    } catch (err) {
      message.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

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
            ].map((field) => (
              <Col xs={24} sm={12} key={field.key}>
                <label>{field.label}</label>
                <Input
                  placeholder={field.label}
                  value={profile[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={styles.commentInput}
                />
              </Col>
            ))}
          </Row>
          <Button
            type="primary"
            loading={updating}
            onClick={handleUpdate}
            className={styles.postButton}
          >
            Update
          </Button>
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
                src={profile.profile_picture}
                size={80}
                style={{ cursor: "pointer" }}
                onClick={() => document.getElementById("avatarInput").click()}
              />
              <div className={styles.editIcon}>
                <EditOutlined
                  onClick={() => document.getElementById("avatarInput").click()}
                />
              </div>
            </div>
            <input
              type="file"
              id="avatarInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
            <h2>
              {profile.first_name} {profile.last_name}
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

export default ProfilePage;
