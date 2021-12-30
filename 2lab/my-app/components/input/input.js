import { useState } from "react";
import styles from "./input.module.scss";

export default function FormInput({ id, disabled, labelText, type, formId }) {
  const [errorInput, setError] = useState("");
  function checkValidation(event) {
    const value = event.target.value;

    if (value === "") {
      setError("The field must be not empty!");
      return;
    }
    if (type === "email" && !validateEmail(value)) {
      setError("The text you entered is not an email address!");
      return;
    }
    setError("");
  }

  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function validateEmail(email) {
    return re.test(email);
  }
  return (
    <div className={styles["form-control-" + type]}>
      {type === "email" && (
        <label>
          {labelText}
          <br />
          <input
            className={errorInput && styles["red-border"]}
            type="email"
            id={id}
            maxLength="40"
            placeholder="Your email address here..."
            onChange={checkValidation}
            disabled={disabled}
            required
          />
        </label>
      )}
      {type === "text" && (
        <label>
          Enter messuage:
          <br />
          <textarea
            className={errorInput !== "" ? styles["red-border"] : ""}
            form={formId}
            id="messuage"
            placeholder="Text of the messuage here..."
            onChange={checkValidation}
            required
          ></textarea>
        </label>
      )}
      <p className={styles.error}>{errorInput}</p>
    </div>
  );
}
