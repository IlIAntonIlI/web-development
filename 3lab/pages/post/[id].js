import Head from "next/head";
import Header from "/components/header/header";
import Footer from "/components/footer/footer";
import Alert from "/components/alert/alert";
import Loader from "/components/loader/loader";
import styles from "./[id].module.scss";
import { useState } from "react";

export default function Post({ route }) {
  const [posts, setPosts] = useState([]);
  const [textOfAlert, setTextAlert] = useState("");
  const [colorOfAlert, setColorAlert] = useState("");

  async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(process.env.DATABASE_LINK, {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    });

    return await result.json();
  }

  const operationsDoc = `
    query MyQuery {
      posts(where: {id: {_eq: "${route.toString()}"}}) {
        author
        postText
        date
        Theme
      }
    }
  `;

  function fetchMyQuery() {
    return fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async function startFetchMyQuery() {
    const { errors, data } = await fetchMyQuery();

    if (errors) {
      setTextAlert("Error while fetching data");
      setColorAlert("red");
    }
    if (posts.length == 0) {
      setPosts(data.posts);
    }
  }

  startFetchMyQuery();

  const closingFunction = function () {
    if (textOfAlert) {
      setTextAlert("");
    }
  };
  return (
    <>
      <Head>
        <title>{posts.length ? posts[0].Theme : route}</title>
      </Head>
      <Header />

      {posts.length == 0 ? (
        <>
          <main className={styles["post-content"]}></main>
          <Loader />
        </>
      ) : (
        <main className={styles["post-content"]}>
          <Alert
            text={textOfAlert}
            color={colorOfAlert}
            close={closingFunction}
          />
          <h1>{posts[0].Theme}</h1>
          <br />
          <h2>Author: {posts[0].author}</h2>
          <br />
          <h2>
            Date of creation:{" "}
            {posts[0].date.slice(0, 10) + " | " + posts[0].date.slice(11, 19)}
          </h2>
          <br />
          <span>{posts[0].postText}</span>
        </main>
      )}

      <Footer />
    </>
  );
}

Post.getInitialProps = async (ctx) => {
  return {
    route: ctx.query.id,
  };
};
