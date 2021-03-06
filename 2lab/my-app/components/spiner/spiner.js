import stylesSpiner from "./spiner.module.scss";
import Image from "next/image";

export default function spiner({ visibility }) {
  return (
    <div
      className={
        visibility
          ? stylesSpiner["loader-container"]
          : stylesSpiner["loader-container"] + " " + stylesSpiner.hidden
      }
    >
      <Image
        src="/images/spiner.gif"
        alt="spinner "
        width="100%"
        height="100%"
      />
    </div>
  );
}
