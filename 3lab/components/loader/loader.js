import stylesLoader from "./loader.module.scss";
import Image from "next/image";

export default function Loader() {
  return (
    <div className={stylesLoader["loader-container"]}>
      <Image
        src="/images/loading.gif"
        layout="fill"
        alt="Loader with cat at circle"
      />
      <div>L o a d i n g...</div>
    </div>
  );
}
