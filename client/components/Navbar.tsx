import Link from "next/link";
import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";

// function WelcomeMsg() {
//   if (isLoading) return <p>Loading...</p>;
//   if (!data) return <p></p>;

//   return <div>Welcome back, {data.username}!</div>;
// }

export default function Navbar() {
  const [username, setUsername] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data: user_data) => {
        setUsername(data.username);
        setLoading(false);
      });
  }, []);

  let Body = (
    <>
      <div className={styles.nav_item}>
        <Link href="/register">register</Link>
      </div>
      <div className={styles.nav_item}>
        <Link href="/login">login</Link>
      </div>
    </>
  );

  if (username) {
    Body = (
      <>
        <div className={styles.nav_item}>
          <Link href={"/logout"}>logout</Link>
        </div>
        <div className={styles.nav_item}>
          <Link href={`/settings?username=${username}`}>settings</Link>
        </div>
      </>
    );
  }
  return (
    <div id={styles.navbar}>
      {Body}
      <div className={styles.nav_item} id={styles.home}>
        <Link href="/">Home</Link>
      </div>
    </div>
  );
}
