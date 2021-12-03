import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Spiner from "../components/spiner/spiner";
import Alert from "../components/alert/alert";
import InputEmail from "../components/inputEmail/inputEmail";
import InputText from "../components/inputText/inputText";
import { useState } from "react";

export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default function Home() {
  const [visibilityOfSpiner, setVisibility] = useState(false);
  const [disabledButton, setDisabledButoon] = useState("");
  const [textOfAlert, setTextAlert] = useState("");
  const [colorOfAlert, setColorAlert] = useState("");

  function prevent(event) {
    event.preventDefault();
    checkInfo(event);
  }

  function checkInfo(event) {
    const secondEmail = event.target.elements.sendFor.value;
    const messuage = event.target.elements.messuage.value;
    setDisabledButoon(!"");
    if (validateEmail(secondEmail) && messuage !== "") {
      setVisibility(true);
      const bodyToSend = {
        where: secondEmail,
        letter: messuage,
      };
      fetch("/api/server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToSend),
      })
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          setVisibility(false);
          setTextAlert(data.meta.data.messuage);
          setColorAlert(data.meta.data.color);
        })
        .catch((e) => {
          setTextAlert("Error while sending");
          setColorAlert("red");
        });
    } else {
      setVisibility(false);
      setTextAlert("Enter correct information and fill all fields of form!");
      setColorAlert("red");
    }
  }

  const closeFunction = function () {
    setDisabledButoon("");
    setTextAlert("");
  };

  return (
    <>
      <Head>
        <title>Mailer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/titleImage.jpg" />
      </Head>
      <div className={styles.container}>
        <Alert text={textOfAlert} color={colorOfAlert} close={closeFunction} />
        <h1>Form for sending messages</h1>
        <section className={styles["form-container"]}>
          <div className={styles["form-mail"]}>
            <form id="emailForm" onSubmit={prevent}>
              <InputEmail
                id="sendFor"
                labelText="Enter your e-mail:"
                disabled=""
              />
              <InputText formId="emailForm" />
              <div className={styles["button-container"]}>
                <div className={styles["button-wrap"]}>
                  <button
                    type="submit"
                    id="sendButton"
                    disabled={disabledButton}
                  >
                    Send
                  </button>
                </div>
                <div className={styles["spinner-wrap"]}>
                  <Spiner visibility={visibilityOfSpiner} />
                </div>
              </div>
            </form>
          </div>
          <div className={styles["img-background"]}></div>
        </section>
      </div>
    </>
  );
}
