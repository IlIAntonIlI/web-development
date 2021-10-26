import Head from "next/head";

import styles from "/styles/Home.module.scss";
import Header from "/components/header/header";
import Post from "/components/post/post";
import Footer from "/components/footer/footer";
import Loader from "/components/loader/loader";
import { useState } from "react";

export default function Home() {
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
      posts {
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
      // handle those errors like a pro
      console.error(errors);
    }
    if (posts.length == 0) {
      setPosts(data.posts);
    }
  }
  startMyFetch();

  async function refreshData() {
    const { errors, data } = await fetchMyQuery();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }
    if (posts.length != data.posts.length) {
      setPosts(data.posts);
    }
  }

  return (
    <>
      <Head>
        <title>Stories</title>
      </Head>
      <Header refreshData={refreshData} />
      {posts.length == 0 ? <Loader /> : <></>}
      <main className={styles.postslist}>
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
