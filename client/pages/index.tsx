import { useState, useEffect } from "react";
import styles from "./css/wrapper.module.css";

function WelcomeMsg() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_API_URL + "/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: user_data) => {
        setData({ id: data.id, username: data.username });
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data?.username) return <p>You are not logged in.</p>;

  return <div>Welcome back, {data.username}!</div>;
}

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <WelcomeMsg />
    </div>
  );
}
