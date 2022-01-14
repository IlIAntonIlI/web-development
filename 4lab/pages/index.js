import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Menu from "../components/burgerMenu/burgerMenu";
import Slider from "../components/slider/slider";

export default function Home() {
  return (
    <>
      <header>
        <Menu />
      </header>
      <main>
        <Slider />
      </main>
    </>
  );
}
