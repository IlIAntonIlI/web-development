import stylesFooter from "./footer.module.scss";

export default function Footer({ visibility, text, color, close }) {
  return (
    <footer className={stylesFooter.footer}>
      <div>
        Contact us:{" "}
        <a href="mailto:stories.000@gmail.com">stories.000@gmail.com</a>
      </div>
    </footer>
  );
}
