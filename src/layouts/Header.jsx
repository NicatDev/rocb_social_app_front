import { NavLink } from "react-router-dom";
import { Avatar, Drawer, Button, Divider } from "antd";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import Logo from "../assets/logo.png";
import styles from "./style.module.scss";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function HeaderComponent() {
  const { profile, logout } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);
  console.log(profile);
  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        {/* Left: Logo */}
        <div className={styles.left}>
          <img src={Logo} alt="Logo" width={44} height={55} />
        </div>

        {/* Middle: Menu */}
        <div className={styles.middle}>
          {/* Desktop Links */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${styles.profileLink} ${styles.active}`
                : styles.profileLink
            }
          >
            Home
          </NavLink>
          {profile?.is_superuser && (
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                isActive
                  ? `${styles.profileLink} ${styles.active}`
                  : styles.profileLink
              }
            >
              Notifications
            </NavLink>
          )}

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? `${styles.profileLink} ${styles.active}`
                : styles.profileLink
            }
          >
            Profile
          </NavLink>
        </div>

        {/* Right: User info + Hamburger */}
        <div className={styles.right}>
          <div className={styles.desktopUser}>
            <NavLink to="/profile" className={styles.profile}>
              <div>
                <span className={styles.username}>
                  {profile?.first_name} {profile?.last_name}
                </span>
                <Avatar
                  style={{ border: "1px solid #d9d9d9" }}
                  size="medium"
                  src={profile?.profile_picture}
                />
              </div>
            </NavLink>

            <LogoutOutlined onClick={logout} className={styles.logout} />
          </div>

          {/* Mobile Hamburger */}
          <Button
            className={styles.mobileMenuButton}
            icon={<MenuOutlined />}
            onClick={showDrawer}
          />
        </div>

        {/* Drawer for Mobile */}
        <Drawer
          className={styles?.drawerBodyClass}
          title="Menu"
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
        >
          <NavLink to="/" className={styles.drawerLink} onClick={closeDrawer}>
            Home
          </NavLink>
          <Divider className={styles?.divider} />
          {profile?.is_superuser && (<>
          <NavLink
            to="/notifications"
            className={styles.drawerLink}
            onClick={closeDrawer}
          >
            Notifications
          </NavLink>
          <Divider className={styles?.divider} />

          <NavLink
            to="/profile"
            className={styles.drawerLink}
            onClick={closeDrawer}
          >
            Profile
          </NavLink>
          <Divider className={styles?.divider} /></>)}

          <NavLink className={styles?.redText} onClick={logout}>
            Logout
          </NavLink>
        </Drawer>
      </div>
    </header>
  );
}

export default HeaderComponent;
