import Head from "next/head";
import Header from "/components/header/header";
import Footer from "/components/footer/footer";
import Loader from "/components/loader/loader";
import styles from "./[id].module.scss";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Post({ route }) {
  //const router = useRouter();
  const [posts, setPosts] = useState([]);

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
      // handle those errors like a pro
      console.error(errors);
    }
    console.log(data);
    // do something great with this precious data
    if (posts.length == 0) {
      setPosts(data.posts);
    }
  }

  startFetchMyQuery();
  console.log(route);
  return (
    <>
      <Head>
        <title>{posts[0].Theme}</title>
      </Head>
      <Header />

      <main className={styles["post-content"]}>
        {posts.length == 0 ? (
          <Loader />
        ) : (
          <>
            <h1>{posts[0].Theme}</h1>
            <br />
            <h2>Author: {posts[0].author}</h2>
            <br />
            <h2>Date of creation: {posts[0].date}</h2>
            <br />
            <span>{posts[0].postText}</span>
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
