import stylesAlert from "./alert.module.scss";
import Head from "next/head";

const classAlertContainer = "alert-container";
export default function Alert({ visibility, text, color, close }) {
  return (
    <div
      className={
        visibility
          ? color == "green"
            ? stylesAlert[classAlertContainer] +
              " " +
              stylesAlert["green-background"] +
              " " +
              stylesAlert.move
            : stylesAlert[classAlertContainer] +
              " " +
              stylesAlert["red-background"] +
              " " +
              stylesAlert.move
          : stylesAlert.hidden + " " + stylesAlert[classAlertContainer]
      }
    >
      <Head>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
          integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <div className={stylesAlert.text}>{text}</div>
      <div className={stylesAlert["close-button"]}>
        <i className="fas fa-times" onClick={close}></i>
      </div>
    </div>
  );
}
