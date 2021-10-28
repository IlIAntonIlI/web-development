import stylesForm from "./formCreate.module.scss";
import Spiner from "../spiner/spiner";
import Alert from "../alert/alert";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Form({ visibility, closeFunction, refreshData }) {
  const [visibilityOfSpiner, setVisibilityOfSpiner] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [visibilityOfAlert, setVisibilityAlert] = useState(false);
  const [textOfAlert, setTextAlert] = useState("");
  const [colorOfAlert, setColorAlert] = useState("");
  const router = useRouter();
  const closingFunction = function () {
    if (visibilityOfAlert) {
      setVisibilityAlert(false);
      setDisabledButton(false);
      setVisibilityOfSpiner(false);
      if (router.pathname === "/") refreshData();
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
        if (data.meta.data.created) {
          let author = e.target.elements.author.value;
          let theme = e.target.elements.theme.value;
          let text = e.target.elements.text.value;
          //sanitizing values...
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
                    __typename
                    }
                    
                    mutation MyMutation {
                    insert_posts_one(object: {Theme: "${theme}", author: "${author}", postText: "${text}"}) {
                        id
                    }
                    }
                `;

          function executeMyMutation() {
            return fetchGraphQL(operationsDoc, "MyMutation", {});
          }

          let color = data.meta.data.color;
          async function startExecuteMyMutation() {
            const { errors, data } = await executeMyMutation();
            if (errors) {
              setTextAlert("Error while creating post");
              setVisibilityAlert(true);
              setColorAlert(data.meta.data.color);
              return;
            }
            setTextAlert("Succesfuly created");
            setVisibilityAlert(true);
            setColorAlert(color);
          }
          startExecuteMyMutation();
          return;
        }
        setTextAlert(data.meta.data.messuage);
        setVisibilityAlert(true);
        setColorAlert(data.meta.data.color);
      })
      .catch((e) => {
        setTextAlert("Error while creating post");
        setColorAlert("red");
      });
  }
  const formConatiner = "form-container";
  const formControl = "form-control";
  return (
    <div
      className={
        visibility
          ? stylesForm[formConatiner]
          : stylesForm[formConatiner] + " " + stylesForm.hidden
      }
    >
      <Alert
        visibility={visibilityOfAlert}
        text={textOfAlert}
        color={colorOfAlert}
        close={closingFunction}
      />
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
        <div className={stylesForm[formControl]}>
          <label>Text:</label>
          <textarea
            form="createPostForm"
            id="text"
            className={stylesForm["text-input"]}
            required
          />
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
