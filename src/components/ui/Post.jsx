import { useState, useMemo } from "react";
import axiosInstance from "@/config/Axios";
import {
  Button,
  Card,
  Input,
  Typography,
  Modal,
  Image,
  List,
  Divider,
  App as AntdApp,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  FileOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import styles from "./styles.module.scss";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;

const Post = ({ post }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [moreContent, setMoreContent] = useState(false);
  const [visibleComments, setVisibleComments] = useState(1);
  const [comments, setComments] = useState(post?.reviews || []);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(post?.liked_by_user);
  const [likeCount, setLikeCount] = useState(post?.like_count);
  const [isDeleted, setIsDeleted] = useState(false);
  const { message } = AntdApp.useApp();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const toggleLike = async () => {
    const previousLiked = liked;
    const previousCount = likeCount;

    setLiked(!liked);
    setLikeCount(likeCount + (liked ? -1 : 1));

    try {
      if (!previousLiked) {
        const response = await axiosInstance.post("/content/likes/", {
          post: post.id,
        });
        setLiked(response.data.id);
        message.success("Liked successfully");
      } else {
        if (!liked) return;
        await axiosInstance.delete(`/content/likes/${liked}/`);
        setLiked(null);
        message.success("Unliked successfully");
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
      message.error("Failed to toggle like");
      setLiked(previousLiked);
      setLikeCount(previousCount);
    }
  };

  const formattedDate = useMemo(() => {
    if (!post?.created_date) return "";
    return new Date(post.created_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [post.created_date]);

  const truncateContent = (content, length = 300) =>
    content?.length > length ? `${content.slice(0, length)}...` : content || "";

  const handleFileClick = (fileUrl) => setFilePreview(fileUrl);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const response = await axiosInstance.post("/content/reviews/", {
        content: newComment,
        post: post.id,
      });

      setComments((prev) => [response.data, ...prev]);
      setVisibleComments((prev) => prev + 1);
      setNewComment("");
      message.success("Comment added!");
    } catch (error) {
      console.error(error);
      message.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (username) => {
    if (username === profile.username) {
      navigate("/profile");
    } else {
      navigate(`/profile/${username}`);
    }
  };

  if (!post || !post.user) return null;

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axiosInstance.delete(
        `http://46.62.145.90:500/api/content/posts/${post.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsDeleted(true);
      message.success("Post deleted successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete post.");
    }
  };
  return (
    <div className={isDeleted && styles?.deleted}>
      <Modal
        className={styles.Modal}
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

      <Card
        key={post.id}
        className={styles.postCard}
        title={
          <Text
            className={styles.username}
            strong
            onClick={() => handleProfileClick(post?.user)}
          >
            {post.user}
          </Text>
        }
        extra={
          <div className={styles?.extra}>
            <Text type="secondary">{formattedDate}</Text>
            <DeleteFilled
              onClick={handleDelete}
              className={styles?.trashIcon}
            />
          </div>
        }
        actions={[
          <div className={styles.commentDiv} key="comments">
            <List
              className={`${!comments.length && styles.noComment} ${
                styles.commentList
              }`}
              itemLayout="horizontal"
              dataSource={comments.slice(0, visibleComments)}
              renderItem={(item) => (
                <List.Item key={item.id} className={styles.commentBox}>
                  <List.Item.Meta
                    title={
                      <p
                        className={styles.commentTitle}
                        onClick={() => handleProfileClick(item?.user)}
                      >
                        {item?.user}
                      </p>
                    }
                    description={item?.content}
                  />
                </List.Item>
              )}
            />

            <Divider
              className={`${visibleComments.length > 1 && styles.noComment} ${
                styles?.divider
              }`}
            />

            {visibleComments < comments.length && (
              <div id={`c${post.id}`} className={styles.viewMoreComment}>
                <Button
                  type="link"
                  onClick={() => setVisibleComments(comments.length)}
                >
                  View More
                </Button>
              </div>
            )}

            {visibleComments == comments.length && comments.length != 1 && (
              <div className={styles.viewMoreComment}>
                <Button type="link" onClick={() => setVisibleComments(1)}>
                  Hide
                </Button>
              </div>
            )}
            <div className={styles.commentInput}>
              <Button
                type="secondary"
                className={styles.likeButton}
                icon={
                  liked ? (
                    <HeartFilled style={{ color: "#1677ff" }} />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={toggleLike}
              >
                <Text type="secondary">{likeCount}</Text>
              </Button>
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onPressEnter={handleSendComment}
                disabled={loading}
                suffix={
                  <Button
                    type="link"
                    onClick={handleSendComment}
                    loading={loading}
                  >
                    Send
                  </Button>
                }
              />
            </div>
          </div>,
        ]}
      >
        <Text>
          {truncateContent(post.content)}
          {post.content?.length > 300 && !moreContent && (
            <Button
              type="link"
              style={{ border: "none" }}
              onClick={() => setMoreContent(true)}
            >
              View More
            </Button>
          )}
          {(post.content?.length < 300 || moreContent) && post.content}
        </Text>

        {post.image && (
          <div className={styles.imageWrapper}>
            <Image src={post.image} alt="Post media" className={styles.media} />
          </div>
        )}

        {post.file && (
          <div className={styles.fileWrapper}>
            <Button
              icon={<FileOutlined />}
              onClick={() => handleFileClick(post.file)}
              className={styles.fileButton}
            >
              {(() => {
                const fileName = post.file.split("/").pop();
                return fileName.length > 15
                  ? fileName.slice(0, 15) + "..."
                  : fileName;
              })()}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Post;
