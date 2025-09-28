import { BrowserRouter as Router } from "react-router-dom";
import { App as AntdApp, ConfigProvider } from "antd";
import { themeToken, components, getCustomLocale } from "@/config/Antd";
import { setNotificationApi } from "@/components/utils/notification";
import { AuthProvider } from "@/context/AuthContext";
import RoutesRenderer from "@/routes/RoutesRenderer";

function App() {
  return (
    <ConfigProvider
      theme={{ components, token: themeToken }}
      locale={getCustomLocale()}
    >
      <AntdApp>
        <Router>
          <AuthProvider>
            <Initializer />
            <RoutesRenderer />
          </AuthProvider>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}

const Initializer = () => {
  const { notification } = AntdApp.useApp();
  setNotificationApi(notification);
  return null;
};

export default App;
