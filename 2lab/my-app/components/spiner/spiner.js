import stylesSpiner from "./spiner.module.css";

export default function spiner() {
  return (
    <div className={stylesSpiner.loaderContainer}>
      <div className={stylesSpiner.ldsSpinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
