import React from "react";
import { Card, Input, Button, Upload, Flex, Divider } from "antd";
import { PictureOutlined, FileAddOutlined, SendOutlined } from "@ant-design/icons";
import styles from "./style.module.scss";

const { TextArea } = Input;

const CreatePost = () => {
  return (
    <Card className={styles.createPost}>
      {/* üst hissə */}
      <TextArea
        placeholder="What do you want to talk about?"
        autoSize={{ minRows: 3, maxRows: 6 }}
        className={styles.textarea}
      />

      <Divider className={styles.divider} />

      {/* aşağı action hissə */}
      <Flex justify="space-between" align="center">
        <Flex gap="middle">
          <Upload showUploadList={false}>
            <Button icon={<PictureOutlined />} type="text">
              Photo
            </Button>
          </Upload>
          <Upload showUploadList={false}>
            <Button icon={<FileAddOutlined />} type="text">
              File
            </Button>
          </Upload>
        </Flex>

        <Button
          type="primary"
          icon={<SendOutlined />}
          className={styles.postButton}
        >
          Post
        </Button>
      </Flex>
    </Card>
  );
};

export default CreatePost;
