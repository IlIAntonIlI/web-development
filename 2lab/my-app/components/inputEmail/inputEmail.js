import { useState } from "react";
import styles from "./inputEmail.module.scss";

export default function InputEmail({ id, disabled, labelText }) {
  const [errorEmail, setErrorEmail] = useState("");
  const [inputEmailBorderColor, setInputEmailBorderColor] = useState("");
  function checkValidation(event) {
    const email = event.target.value;

    if (email === "") {
      setErrorEmail("The field must be not empty!");
      setInputEmailBorderColor("red");
      return;
    }
    if (validateEmail(email)) {
      setErrorEmail("");
      setInputEmailBorderColor("");
      return;
    }
    setErrorEmail("The text you entered is not an email address!");
    setInputEmailBorderColor("red");
  }

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  return (
    <div className={styles.formControl}>
      <label htmlFor={id}>{labelText}</label> <br />
      <input
        className={inputEmailBorderColor == "red" ? styles.redBorder : ""}
        type="email"
        id={id}
        maxLength="40"
        placeholder="Recipient's email address here..."
        onChange={checkValidation}
        disabled={disabled}
        required
      />
      <p className={styles.error}>{errorEmail}</p>
    </div>
  );
}
