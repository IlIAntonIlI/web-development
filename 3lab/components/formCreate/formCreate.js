import stylesForm from "./formCreate.module.scss";
import Spiner from "../spiner/spiner";
import Alert from "../alert/alert";
import { useState } from "react";

export default function Form({ visibility, closeFunction }) {
  const [visibilityOfSpiner, setVisibilityOfSpiner] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [textOfAlert, setTextAlert] = useState("");
  const [colorOfAlert, setColorAlert] = useState("");
  const closingFunction = function () {
    if (textOfAlert) {
      setTextAlert("");
      setDisabledButton(false);
    }
  };
  function handleSubmit(e) {
    e.preventDefault();
    setVisibilityOfSpiner(true);
    setDisabledButton(true);
    fetch("/api/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        if (data?.created) {
          async function fetchGraphQL(operationsDoc, operationName, variables) {
            const result = await fetch(process.env.DATABASE_LINK, {
              method: "POST",
              body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            return await result.json();
          }

          const operationsDoc = `                   
                    mutation MyMutation($theme: String!, $author: String!, $post: String!) {
                    insert_posts_one(object: {Theme: $theme, author: $author, postText: $post}) {
                        id
                    }
                    }
                `;

          function executeMyMutation() {
            return fetchGraphQL(operationsDoc, "MyMutation", {
              theme: e.target.elements.theme.value,
              author: e.target.elements.author.value,
              post: e.target.elements.text.value,
            });
          }
          executeMyMutation();
        }
        setTextAlert(data.messuage);
        setColorAlert(data.color);
      })
      .catch((e) => {
        setTextAlert("Something went wrong :(\nTry again later.");
        setColorAlert("red");
      })
      .finally(() => {
        setVisibilityOfSpiner(false);
      });
  }
  const formConatiner = "form-container";
  const formControl = "form-control";
  return (
    <div
      className={
        stylesForm[formConatiner] + " " + (!visibility && stylesForm.hidden)
      }
    >
      <Alert text={textOfAlert} color={colorOfAlert} close={closingFunction} />
      <div className={stylesForm["close-button-conatiner"]}>
        <div onClick={closeFunction}></div>
      </div>
      <form id="createPostForm" onSubmit={handleSubmit}>
        <div className={stylesForm[formControl]}>
          <label>Author:</label>
          <input
            type="text"
            id="author"
            maxLength="15"
            autoComplete="off"
            required
          />
        </div>
        <div className={stylesForm[formControl]}>
          <label>Theme:</label>
          <input
            type="text"
            id="theme"
            maxLength="15"
            autoComplete="off"
            required
          />
        </div>
        <div className={stylesForm["form-control-text"]}>
          <label>Text:</label>
          <textarea form="createPostForm" id="text" required />
        </div>
        <div className={stylesForm["form-control-button"]}>
          <div className={stylesForm["button-container"]}>
            <button disabled={disabledButton}>Create</button>
          </div>
          <Spiner visibility={visibilityOfSpiner} />
        </div>
      </form>
    </div>
  );
}
