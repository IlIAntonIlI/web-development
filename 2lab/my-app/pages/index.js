import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Spiner from "../components/spiner/spiner";
import Alert from "../components/alert/alert";
import InputEmail from "../components/inputEmail/inputEmail";
import InputText from "../components/inputText/inputText";
import { useState } from "react";

export default function Home() {
  const [visibilityOfSpiner, setVisibility] = useState(false);
  const [disabledButton, setDisabledButoon] = useState('');
  const [visibilityOfAlert, setVisibilityAlert] = useState(false);
  const [textOfAlert, setTextAlert] = useState('');
  const [colorOfAlert, setColorAlert] = useState('');

  function prevent(event) {
    event.preventDefault();
    checkInfo(event);
  }

  function checkInfo(event) {
    const fisrtEmail = event.target.elements.senderEmail.value;
    const secondEmail = event.target.elements.sendFor.value;
    const messuage = event.target.elements.messuage.value;
    setDisabledButoon(!"");
    if (
      validateEmail(fisrtEmail) &&
      validateEmail(secondEmail) &&
      messuage !== ""
    ) {
      setVisibility(true);
      const bodyToSend = {
        from: fisrtEmail,
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
            setVisibilityAlert(true);
            setTextAlert(data.messuage);
            setColorAlert(data.color);
        })
        .catch((e) => {
          setTextAlert('Error while sending');
          setColorAlert('red');
          return;
        });
    } else {
      setVisibilityAlert(true);
      setTextAlert('Enter correct information and fill all fields of form!');
      setColorAlert('red');
    }
  }

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  const closeFunction = function () {
    if (visibilityOfAlert) {
      setVisibilityAlert(false);
      setDisabledButoon("");
      setVisibility(false);
    }
  };

  return (
    <>
      <Head>
        <title>Mailer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/titleImage.jpg" />
      </Head>
      <div className={styles.container}>
        <Alert
          visibility={visibilityOfAlert}
          text={textOfAlert}
          color={colorOfAlert}
          close={closeFunction}
        />
        <h1>Form for sending messages</h1>
        <section className={styles.formContainer}>
          <div className={styles.formMail}>
            <form id="emailForm" onSubmit={prevent}>
              <InputEmail id='senderEmail' labelText='Enter your email:' disabled=''/>
              <InputEmail id='sendFor' labelText='Enter recipient&rsquo;s e-mail:' disabled=''/>
              <InputText formId='emailForm' />
              <div className={styles.buttonContainer}>
                <div className={styles.buttonWrap}>
                  <button
                    type="submit"
                    id="sendButton"
                    disabled={disabledButton}
                  >
                    Send
                  </button>
                </div>
                <div className={styles.spinnerWrap}>
                  <Spiner visibility={visibilityOfSpiner} />
                </div>
              </div>
            </form>
          </div>
          <div className={styles.imgBackground}></div>
        </section>
      </div>
    </>
  );
}
