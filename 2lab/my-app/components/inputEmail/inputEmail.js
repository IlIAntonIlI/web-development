import { useState } from "react";
import styles from "./inputEmail.module.scss";

export default function InputEmail({ id, disabled, labelText }) {
  const [errorEmail, setErrorEmail] = useState("");
  // const [inputEmailBorderColor, setInputEmailBorderColor] = useState("");
  function checkValidation(event) {
    const email = event.target.value;

    if (email === "") {
      setErrorEmail("The field must be not empty!");
      return;
    }
    if (validateEmail(email)) {
      setErrorEmail("");
      return;
    }
    setErrorEmail("The text you entered is not an email address!");
  }

  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function validateEmail(email) {
    return re.test(email);
  }
  return (
    <div className={styles["form-control"]}>
      <label>
        {labelText}
        <br />
        <input
          className={errorEmail !== "" ? styles["red-border"] : ""}
          type="email"
          id={id}
          maxLength="40"
          placeholder="Your email address here..."
          onChange={checkValidation}
          disabled={disabled}
          required
        />
      </label>
      <p className={styles.error}>{errorEmail}</p>
    </div>
  );
}
