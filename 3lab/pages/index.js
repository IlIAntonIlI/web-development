import Head from "next/head";
import styles from "/styles/Home.module.scss";
import Header from "/components/header/header";
import Post from "/components/post/post";
import Footer from "/components/footer/footer";
import Alert from "/components/alert/alert";
import Loader from "/components/loader/loader";
import { useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [visibilityOfAlert, setVisibilityAlert] = useState(false);
  const [textOfAlert, setTextAlert] = useState("");
  const [colorOfAlert, setColorAlert] = useState("");
  async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
      "https://web-kpi-lab3.herokuapp.com/v1/graphql",
      {
        method: "POST",
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName,
        }),
      }
    );

    return await result.json();
  }

  const operationsDoc = `
    query MyQuery {
      posts(order_by: {date: desc}) {
        author
        id
        postText
        date
        Theme
      }
    }
  `;

  function fetchMyQuery() {
    return fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async function startMyFetch() {
    const { errors, data } = await fetchMyQuery();

    if (errors) {
      setVisibilityAlert(true);
      setTextAlert("Error while fetching data");
      setColorAlert("red");
    }
    if (posts.length == 0) {
      setPosts(data.posts);
    }
  }
  startMyFetch();

  async function refreshData() {
    const { errors, data } = await fetchMyQuery();

    if (errors) {
      setVisibilityAlert(true);
      setTextAlert("Error while fetching data");
      setColorAlert("red");
    }
    if (posts.length != data.posts.length) {
      setPosts(data.posts);
    }
  }

  const closingFunction = function () {
    if (visibilityOfAlert) {
      setVisibilityAlert(false);
    }
  };

  return (
    <>
      <Head>
        <title>Stories</title>
      </Head>
      <Header refreshData={refreshData} />
      <Alert
        visibility={visibilityOfAlert}
        text={textOfAlert}
        color={colorOfAlert}
        close={closingFunction}
      />

      <main className={styles.postslist}>
        <Loader />
        {posts.length == 0 ? (
          <></>
        ) : (
          posts.map((post) => (
            <div key={post.id}>
              <Post
                theme={post.Theme}
                id={post.id}
                author={post.author}
                text={post.postText}
                date={post.date}
              />
            </div>
          ))
        )}
      </main>

      <Footer />
    </>
  );
}
