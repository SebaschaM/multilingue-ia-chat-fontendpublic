import { Aside } from "../components";
import styles from "./LayoutDashboard.module.css";

export default function LayoutDashboard({ children, title }) {
  return (
    <>
      <div>
        <title>{title}</title>
      </div>

      <div className={styles.dashboard_container}>
        <Aside />
        {children}
      </div>
    </>
  );
}
