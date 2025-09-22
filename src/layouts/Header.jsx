import { Link, useLocation } from "react-router-dom";
import { Menu, Avatar } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Logo from "../assets/logo.png";
import Home from "../assets/home.svg";
import User from "../assets/user.svg";
import styles from "./style.module.scss";
import { useAuth } from "../context/AuthContext";


function HeaderComponent() {
    const { profile, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <div className={styles.left}>
          <img src={Logo} alt="Logo" width={44} height={55} />
        </div>
        {/* Left: Logo */}

        {/* Middle: Menu */}
        <div className={styles.middle}>
          <div className={styles.middle}>
            <Link to="/" className={styles.profileLink}>
              <img src={Home} alt="Home" style={{ width: 34, height: 34 }} />
            </Link>
            <Link to="/profile" className={styles.profileLink}>
              <img src={User} alt="Profile" style={{ width: 34, height: 34 }} />
            </Link>
          </div>
        </div>

        {/* Right: User info */}
        <div className={styles.right}>
          <div>
            <span className={styles.username}>{profile?.first_name} {profile?.last_name}</span>
            <Avatar style={{border:'1px solid #d9d9d9'}} size="medium" src={profile?.profile_picture} />
          </div>

          <LogoutOutlined onClick={logout} className={styles.logout} />
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
