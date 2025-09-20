import { useState, useMemo } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Input,
  Typography,
  Modal,
  message,
  Image,
  List,
  Divider,
} from "antd";
import { FileOutlined } from "@ant-design/icons";
import styles from "./styles.module.scss";

const { Text } = Typography;

const Post = ({ post }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [visibleComments, setVisibleComments] = useState(1);
  const [comments, setComments] = useState(post?.reviews || []); // local state for comments
  const [newComment, setNewComment] = useState(""); // input state
  const [loading, setLoading] = useState(false);

  const formattedDate = useMemo(
    () => new Date(post.created_date).toLocaleString(),
    [post.created_date]
  );

  const truncateContent = (content, length = 100) =>
    content?.length > length ? `${content.slice(0, length)}...` : content || "";

  const handleFileClick = (fileUrl) => setFilePreview(fileUrl);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://46.62.145.90:500/api/content/reviews/",
        {
          content: newComment,
          post: post.id, // assuming backend needs post id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add new comment to local list
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

  return (
    <>
      {/* File preview modal */}
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
        title={<Text strong>{post.user}</Text>}
        extra={<Text type="secondary">{formattedDate}</Text>}
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
                    title={<p className={styles.commentTitle}>{item?.user}</p>}
                    description={item?.content}
                  />
                </List.Item>
              )}
            />

            <Divider
              className={`${visibleComments.length > 1 && styles.noComment}  ${
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

            <Input
              placeholder="Write a comment..."
              className={styles.commentInput}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onPressEnter={handleSendComment} // Enter to send
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
          </div>,
        ]}
      >
        <Text>
          {truncateContent(post.content)}
          {post.content?.length > 100 && (
            <Button type="link" onClick={() => message.info(post.content)}>
              View More
            </Button>
          )}
        </Text>

        {/* Media */}
        {post.image && (
          <div className={styles.imageWrapper}>
            <Image src={post.image} alt="Post media" className={styles.media} />
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
    </>
  );
};

export default Post;
