import styles from './style.module.scss'

function ContentComponent({ children }) {
  return <main className={styles.content}>{children}</main>
}

export default ContentComponent