import stylesAlert from "./alert.module.scss";
import Head from "next/head";

export default function Alert({ visibility, text, color, close }) {
  const nameOfClass = "alert-container";
  return (
    <div
      className={
        visibility
          ? color == "green"
            ? stylesAlert[nameOfClass] +
              " " +
              stylesAlert["green-bg"] +
              " " +
              stylesAlert.move
            : stylesAlert[nameOfClass] +
              " " +
              stylesAlert["red-bg"] +
              " " +
              stylesAlert.move
          : stylesAlert.hidden + " " + stylesAlert[nameOfClass]
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
        <div onClick={close}></div>
      </div>
    </div>
  );
}
