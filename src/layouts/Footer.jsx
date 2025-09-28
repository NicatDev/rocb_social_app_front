import { Link } from 'react-router-dom'
import styles from './style.module.scss'
function FooterComponent() {
  return (
    <footer className={styles.footer}>
      © 2025 <span><Link to="https://rocb-europe.org/">Rocb Europe </Link></span>All rights reserved.
    </footer>
  )
}

export default FooterComponent