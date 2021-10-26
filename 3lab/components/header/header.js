import stylesHeader from "./header.module.scss";
import Form from "../formCreate/formCreate";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

export default function Header({ refreshData }) {
  const [visibilityOfForm, setVisibilityOfForm] = useState(false);
  function openCloseForm() {
    setVisibilityOfForm(!visibilityOfForm);
  }
  return (
    <header className={stylesHeader.header}>
      <Head>
        <meta name="description" content="Interesting stories" />
        <link rel="icon" href="/images/stories.png" />
      </Head>
      <figure className={stylesHeader["logotype-container"]}>
        <Link href="/">
          <a>
            <Image
              src="/images/stories.png"
              alt="logotype"
              width="100px"
              height="100px"
            />
          </a>
        </Link>
        <Link href="/">
          <a>
            <figcaption> Stories </figcaption>
          </a>
        </Link>
      </figure>
      <div className={stylesHeader["container-creation-button"]}>
        <div onClick={openCloseForm}>
          <i className="far fa-plus-square"></i>
          New post
        </div>
      </div>
      <Form
        visibility={visibilityOfForm}
        closeFunction={openCloseForm}
        refreshData={refreshData}
      />
    </header>
  );
}
