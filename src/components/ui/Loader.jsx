
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

const Loader = () => (
  <Flex style={{ width: "100%", height: "100vh" }}  align="center" gap="middle">
    <Spin style={{ width: "100%" }} indicator={<LoadingOutlined spin />} size="large" />
  </Flex>
);
export default Loader;

