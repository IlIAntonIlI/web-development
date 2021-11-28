import { useState } from "react";
import styles from "./inputText.module.scss";

export default function InputText({ formId }) {
  const [errorText, setErrorText] = useState("");
  function checkIsEmpty(event) {
    const text = event.target.value;
    if (text === "") {
      setErrorText("The field must be not empty!");
      return;
    }
    setErrorText("");
  }
  return (
    <div className={styles["form-control-text"]}>
      <label>
        Enter messuage:
        <br />
        <textarea
          className={errorText !== "" ? styles["red-border"] : ""}
          form={formId}
          id="messuage"
          placeholder="Text of the messuage here..."
          onChange={checkIsEmpty}
          required
        ></textarea>
      </label>

      <p className={styles.error}>{errorText}</p>
    </div>
  );
}
