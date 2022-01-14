import styles from "./slider.module.scss";
import Image from "next/image";

export default function slider() {
  return (
    <>
      <input
        defaultChecked="checked"
        id={styles.first}
        type="radio"
        name="slides"
      />
      <input type="radio" id={styles.second} name="slides" />
      <input type="radio" id={styles.third} name="slides" />
      <div className={styles["slider-container"]}>
        <div>
          <Image
            src="/images/first.jpg"
            alt="Carpathian mountains"
            layout="fill"
            priority="true"
          />
        </div>
        <div>
          <Image
            src="/images/second.jpg"
            alt="Alps mountains"
            layout="fill"
            priority="true"
          />
        </div>
        <div>
          <Image
            src="/images/third.jpg"
            alt="Mountains of the Himalayas"
            layout="fill"
            priority="true"
          />
        </div>
        <div className={styles["left-button-control"]}>
          <label htmlFor={styles.first}></label>
          <label htmlFor={styles.second}></label>
          <label htmlFor={styles.third}></label>
        </div>
        <div className={styles["right-button-control"]}>
          <label htmlFor={styles.first}></label>
          <label htmlFor={styles.second}></label>
          <label htmlFor={styles.third}></label>
        </div>
        <div className={styles["control-panel"]}>
          <label htmlFor={styles.first}></label>
          <label htmlFor={styles.second}></label>
          <label htmlFor={styles.third}></label>
        </div>
      </div>
    </>
  );
}
