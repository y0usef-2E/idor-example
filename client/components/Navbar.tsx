import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <div id={styles.navbar}>
      <div className={styles.nav_item}>
        <Link href="/register">register</Link>
      </div>
      <div className={styles.nav_item}>
        <Link href="/login">login</Link>
      </div>
    </div>
  );
}
