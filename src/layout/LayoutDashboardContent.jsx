import styles from "./LayoutDashboardContent.module.css";

export default function LayoutDashboardContent({ children, title }) {
  return (
    <div className={styles.dashboard_content}>
      <div className={styles.database}>
        <h1>{title}</h1>
        <hr />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
