import Link from "next/link";
import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data: user_data) => {
        setUsername(data.username);
      });
  }, []);

  let Body = (
    <>
      <div className={styles.nav_item}>
        <Link href="/register">Register</Link>
      </div>
      <div className={styles.nav_item}>
        <Link href="/login">Login</Link>
      </div>
    </>
  );

  if (username) {
    Body = (
      <>
        <div className={styles.nav_item}>
          <Link href={"/logout"}>Logout</Link>
        </div>
        <div className={styles.nav_item}>
          <Link href={`/settings?username=${username}`}>Settings</Link>
        </div>
      </>
    );
  }
  return (
    <div id={styles.navbar}>
      {Body}
      <div className={styles.nav_item}>
        <Link href="https://github.com/y0usef-2E/idor-example">GitHub</Link>
      </div>
      <div className={styles.nav_item} id={styles.home}>
        <Link href="/">Home</Link>
      </div>
    </div>
  );
}
