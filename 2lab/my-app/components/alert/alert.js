import stylesAlert from "./alert.module.scss";
import Head from "next/head";

export default function Alert({ text, color, close }) {
  return (
    <div
      className={
        stylesAlert["alert-container"] +
        " " +
        (text && stylesAlert[color + "-bg"])
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
        <div onClick={close}>
          <i className="fas fa-times"></i>
        </div>
      </div>
    </div>
  );
}
