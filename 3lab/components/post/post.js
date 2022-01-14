import stylesPost from "./post.module.scss";
import Link from "next/link";
import Head from "next/head";

export default function Post({ id, author, text, theme, date }) {
  const blockLine = "block-line";
  const columnName = "column-name";
  const columnValue = "column-value";
  return (
    <section className={stylesPost["post-container"]}>
      <div className={stylesPost[blockLine]}>
        <div className={stylesPost[columnName]}>Author:</div>
        <div className={stylesPost[columnValue]}>{author}</div>
      </div>
      <div className={stylesPost[blockLine]}>
        <div className={stylesPost[columnName]}>Theme:</div>
        <div className={stylesPost[columnValue]}>{theme}</div>
      </div>
      <div className={stylesPost[blockLine]}>
        <div className={stylesPost[columnName]}>Date:</div>
        <div className={stylesPost[columnValue]}>{date}</div>
      </div>
      <div className={stylesPost["block-line-text"]}>
        <div className={stylesPost["column-text"]}>Text:</div>
        <div className={stylesPost.text}>
          <div>{text.length > 100 ? text.substr(0, 100) + "..." : text}</div>
        </div>
      </div>
      <div className={stylesPost["block-line-button"]}>
        <Link href={`/post/[id]`} as={`/post/${id}`}>
          <a>
            <div> Read more --&gt;</div>
          </a>
        </Link>
      </div>
    </section>
  );
}
