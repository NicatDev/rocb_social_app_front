import { NavLink } from "react-router-dom";
import { Menu, Avatar } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import Logo from "../assets/logo.png";
import Home from "../assets/home.svg";
import Notify from "../assets/notifications.svg";
import styles from "./style.module.scss";
import { useAuth } from "../context/AuthContext";

function HeaderComponent() {
  const { profile, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        {/* Left: Logo */}
        <div className={styles.left}>
          <img src={Logo} alt="Logo" width={44} height={55} />
        </div>

        {/* Middle: Menu */}
        <div className={styles.middle}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.profileLink} ${styles.active}` : styles.profileLink
            }
          >
            <img src={Home} alt="Home" style={{ width: 34, height: 34 }} />
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              isActive ? `${styles.profileLink} ${styles.active}` : styles.profileLink
            }
          >
            <img src={Notify} alt="Notify" style={{ width: 34, height: 34 }} />
          </NavLink>
        </div>

        {/* Right: User info */}
        <div className={styles.right}>
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
      </div>
    </header>
  );
}

export default HeaderComponent;
