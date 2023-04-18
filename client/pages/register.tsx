import { postData } from "../utils";
import styles from "./css/form.module.css";
const url: string = process.env.NEXT_PUBLIC_API_URL + "/register";

const handleSubmit = async (event) => {
  event.preventDefault();

  const data: user_data = {
    username: event.target.username.value,
    password: event.target.password.value,
    email_address: event.target.email_address.value,
    address: event.target.address.value,
    date_of_birth: event.target.date_of_birth.value,
    phone_number: event.target.phone_number.value,
  };

  const res = await postData(url, data);
  const msg = await res.text();

  if (res.status == 200) {
    window.location.replace("/");
    console.log(msg);
  }
};

export default function Register() {
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
          type="email"
          id="email_address"
          name="email_address"
          placeholder="email address"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
        />
        <input type="text" name="address" id="address" placeholder="address" />
        <input type="date" id="data_of_birth" name="date_of_birth" />
        {/* // https://stackoverflow.com/a/18029630 */}
        <input
          type="tel"
          id="phone_number"
          name="phone_number"
          pattern="\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,3})$"
          placeholder="phone number"
        />
        <button type="submit" id={styles.submit}>
          Register
        </button>
      </form>
    </div>
  );
}
