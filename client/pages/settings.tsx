import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./css/settings.module.css";
import Link from "next/link";
import { patchData } from "./utils";

let match_content = {
  Username: "username",
  Email: "email_address",
  "Phone Number": "phone_number",
  Address: "address",
  "Date of Birth": "date_of_birth",
};
let input_types = {
  username: "text",
  email_address: "email",
  phone_number: "tel",
  address: "text",
  date_of_birth: "date",
};
const url = "http://localhost:8000/settings";

const handleSubmit = async (event, user_id) => {
  event.preventDefault();
  let target = event.target;
  const data: user_data = {};
  for (let i = 0; i < target.length; i++) {
    console.log(target.elements[i].value);
    console.log(
      Object.values(match_content).includes(
        target.elements[i].getAttribute("id")
      )
    );

    if (
      Object.values(match_content).includes(
        target.elements[i].getAttribute("id")
      ) &&
      target.elements[i].value != ""
    ) {
      data[target.elements[i].getAttribute("name")] = target.elements[i].value;
    }
  }
  if (Object.values(data).length != 0) {
    data.id = user_id;
    const res = await patchData(url, data);
    const msg = await res.text();

    if (res.status == 200) {
      window.location.replace("/");
      console.log(msg);
    }
  }
};

export default function Settings() {
  const router = useRouter();
  const { username } = router.query;

  const [data, setData] = useState<user_data | undefined>(null);

  useEffect(() => {
    if (username != undefined) {
      fetch(`http://localhost:8000/user/${username}`)
        .then((res) => res.json())
        .then((data: user_data) => {
          setData(data);
        });
    }
  }, [username]);

  let displaySettings = [];

  for (const key in match_content) {
    displaySettings.push(
      <div key={key} className={styles.label}>
        {key}
      </div>,
      <input
        className={styles.input}
        name={match_content[key]}
        key={match_content[key] + "input"}
        type={input_types[match_content[key]]}
        id={match_content[key]}
      ></input>,
      <div
        className={styles.value}
        key={match_content[key] + "value"}
        id={match_content[key] + "value"}
      >
        {data ? data[match_content[key]] : ""}
      </div>
    );
  }

  let Body = (
    <div id={styles.wrapper}>
      <form
        id={styles.display_data}
        onSubmit={(event) => handleSubmit(event, data.id)}
      >
        <div className={styles.value} style={{ color: "rgb( 0, 122, 16 )" }}>
          Current settings:
        </div>
        {displaySettings}
        <button type="submit" id={styles.submit_button}>
          Update Settings
        </button>
      </form>
      <p>
        <Link
          href="/changepass"
          style={{ textDecoration: "none", color: "rgb(17, 46, 125)" }}
        >
          Change password?
        </Link>
      </p>
    </div>
  );

  return <div>{data ? Body : ""}</div>;
}
