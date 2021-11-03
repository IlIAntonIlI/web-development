import { useState } from "react";
import styles from "./inputText.module.scss";

export default function InputText({ formId }) {
  const [errorText, setErrorText] = useState("");
  const [inputTextBorderColor, setInputTextBorderColor] = useState("");
  function checkIsEmpty(event) {
    const text = event.target.value;
    if (text === "") {
      setErrorText("The field must be not empty!");
      setInputTextBorderColor("red");
      return;
    }
    setErrorText("");
    setInputTextBorderColor("");
  }
  return (
    <div className={styles["form-control-text"]}>
      <label htmlFor="Messuage">Enter messuage:</label> <br />
      <textarea
        className={inputTextBorderColor == "red" ? styles["red-border"] : ""}
        form={formId}
        placeholder="Text of the messuage here..."
        onChange={checkIsEmpty}
        id="messuage"
        required
      ></textarea>
      <p className={styles.error}>{errorText}</p>
    </div>
  );
}
