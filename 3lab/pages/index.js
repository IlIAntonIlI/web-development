import Head from "next/head";
import styles from "/styles/Home.module.scss";
import Header from "/components/header/header";
import Post from "/components/post/post";
import Footer from "/components/footer/footer";
import Alert from "/components/alert/alert";
import Loader from "/components/loader/loader";
import { useState } from "react";
import React from "react";
import { useSubscription } from "urql";
import { useQuery } from "urql";

const MyPosts = `
query {
  posts(order_by: {date: desc}) {
    author
    id
    postText
    date
    Theme
  }
}`;
const newPosts = `
subscription {
  posts(order_by: {date: desc}) {
    author
    id
    postText
    date
    Theme
  }
}`;
export default function Home() {
  const [visibilityOfAlert, setVisibilityAlert] = useState(false);
  const [textOfAlert, setTextAlert] = useState("");
  const [colorOfAlert, setColorAlert] = useState("");

  const closingFunction = function () {
    if (visibilityOfAlert) {
      setVisibilityAlert(false);
    }
  };
  const [result] = useSubscription({
    query: newPosts,
  });

  const { data, fetching, error } = result;
  if (error) {
    setVisibilityAlert(true);
    setTextAlert("Error while fetching data");
    setColorAlert("red");
  }
  return (
    <>
      <Head>
        <title>Stories</title>
      </Head>
      <Header />
      <Alert
        visibility={visibilityOfAlert}
        text={textOfAlert}
        color={colorOfAlert}
        close={closingFunction}
      />
      {fetching || error ? (
        <>
          <main className={styles.postslist}></main>
          <Loader />
        </>
      ) : data.posts.length !== 0 ? (
        <main className={styles.postslist}>
          {data.posts.map((post) => (
            <div key={post.id}>
              <Post
                theme={post.Theme}
                id={post.id}
                author={post.author}
                text={post.postText}
                date={post.date.slice(0, 10) + " | " + post.date.slice(11, 19)}
              />
            </div>
          ))}
        </main>
      ) : (
        <main className={styles.postslist}></main>
      )}

      <Footer />
    </>
  );
}
