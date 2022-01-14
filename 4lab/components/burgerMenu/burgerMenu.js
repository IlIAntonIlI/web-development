import styles from "./burgerMenu.module.scss";

export default function burgerMenu() {
  return (
    <div className={styles["burger-menu-container"]}>
      <input defaultChecked="" type="checkbox" id={styles.menu} />
      <label htmlFor={styles.menu} className={styles["menu-button"]}></label>
      <section>
        <div>Hello world</div>
      </section>
      <label htmlFor={styles.menu} className={styles["close-area"]}></label>
    </div>
  );
}
