import stylesAlert from "./alert.module.scss";
import Head from "next/head";
import { useEffect, useRef } from "react";

export default function Alert({ visibility, text, color, close }) {
  const rootEl = useRef(null);

  useEffect(() => {
    const onClick = (e) => rootEl.current.contains(e.target) || close();
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  });
  return (
    <div
      ref={rootEl}
      className={
        visibility
          ? color == "green"
            ? stylesAlert.alertContainer +
              " " +
              stylesAlert.greenBG +
              " " +
              stylesAlert.move
            : stylesAlert.alertContainer +
              " " +
              stylesAlert.redBG +
              " " +
              stylesAlert.move
          : stylesAlert.hidden + " " + stylesAlert.alertContainer
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
      <div className={stylesAlert.closeButton}>
        <i className="fas fa-times" onClick={close}></i>
      </div>
    </div>
  );
}
