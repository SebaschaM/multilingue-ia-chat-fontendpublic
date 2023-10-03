import { Typography } from "@mui/material";
import styles from "./LayoutDashboardContent.module.css";

export default function LayoutDashboardContent({ children, title }) {
  return (
    <div className={styles.dashboard_content}>
      <Typography variant="h2" component="h1" fontWeight={"900"}>
        {title}
      </Typography>
      <hr />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
