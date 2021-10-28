import Head from "next/head";
import Header from "/components/header/header";
import Footer from "/components/footer/footer";
import Alert from "/components/alert/alert";
import Loader from "/components/loader/loader";
import styles from "./[id].module.scss";
import { useState } from "react";

export default function Post({ route }) {
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
      setVisibilityAlert(true);
      setTextAlert("Error while fetching data");
      setColorAlert("red");
    }
    if (posts.length == 0) {
      setPosts(data.posts);
    }
  }

  startFetchMyQuery();

  const closingFunction = function () {
    if (visibilityOfAlert) {
      setVisibilityAlert(false);
    }
  };
  return (
    <>
      <Head>
        <title>{posts.length ? posts[0].Theme : route}</title>
      </Head>
      <Header />

      <main className={styles["post-content"]}>
        {posts.length == 0 ? (
          <Loader />
        ) : (
          <>
            <Alert
              visibility={visibilityOfAlert}
              text={textOfAlert}
              color={colorOfAlert}
              close={closingFunction}
            />
            <h1>{posts[0].Theme}</h1>
            <br />
            <h2>Author: {posts[0].author}</h2>
            <br />
            <h2>Date of creation: {posts[0].date}</h2>
            <br />
            <span>{posts[0].postText}</span>
            {}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

Post.getInitialProps = async (ctx) => {
  return {
    route: ctx.query.id,
  };
};
