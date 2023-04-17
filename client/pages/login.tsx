import styles from "./css/form.module.css";
import { postData } from "./utils";

const url: string = "http://localhost:8000/login";

const handleSubmit = async (event) => {
  event.preventDefault();

  const data = {
    username: event.target.username.value,
    password: event.target.password.value,
  };

  const res = await postData(url, data);
  const msg = await res.text();

  if (res.status == 200) {
    window.location.replace("/");
    console.log(msg);
  }
};

export default function Login() {
  return (
    <div>
      <form id={styles.form} onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
        />

        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
        />

        <button type="submit" id={styles.submit}>
          Login
        </button>
      </form>
    </div>
  );
}
