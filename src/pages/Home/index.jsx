import { Avatar, Button, Card, Input, Typography } from "antd";
const { Title, Text } = Typography;

const { Meta } = Card;
import {
  UserOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import styles from "./style.module.scss";
import CreatePost from "./components/CreatePost";

const Home = () => {
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
        <CreatePost />
        <Card
          className={styles.postCard}
          title={<Text strong>Jane Smith</Text>}
          extra={<Text type="secondary">2h ago</Text>}
        >
          <div className={styles.comments}>
            <Text>This is a sample post just like LinkedIn!</Text>
            <Input placeholder="Write a comment..." />
          </div>
        </Card>
<Card
          className={styles.postCard}
          title={<Text strong>Jane Smith</Text>}
          extra={<Text type="secondary">2h ago</Text>}
        >
          <div className={styles.comments}>
            <Text>This is a sample post just like LinkedIn!</Text>
            <Input placeholder="Write a comment..." />
          </div>
        </Card>
        <Card
          className={styles.postCard}
          title={<Text strong>Jane Smith</Text>}
          extra={<Text type="secondary">2h ago</Text>}
        >
          <div className={styles.comments}>
            <Text>This is a sample post just like LinkedIn!</Text>
            <Input placeholder="Write a comment..." />
          </div>
        </Card>
        <Card
          className={styles.postCard}
          title={<Text strong>Jane Smith</Text>}
          extra={<Text type="secondary">2h ago</Text>}
        >
          <div className={styles.comments}>
            <Text>This is a sample post just like LinkedIn!</Text>
            <Input placeholder="Write a comment..." />
          </div>
        </Card>
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
  );
};

export default Home;
