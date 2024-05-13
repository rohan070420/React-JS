import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";

import { MessageModel } from "../../../models/MessageModel";

export const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  async function submitMessage() {
    const reviewRequestModel = new MessageModel(title, question);

    if (authState?.isAuthenticatedtitle !== "" && question !== "") {
      const url = `${process.env.REACT_APP_API_URL}/messages/secure/add/messages`;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewRequestModel),
      };
      const submitMessage = await fetch(url, requestOptions);
      if (!submitMessage.ok) {
        throw new Error("Something Went wrong in form submit message!");
      }

      setTitle("");
      setQuestion("");
      setDisplayWarning(false);
      setDisplaySuccess(true);
    } else {
      setDisplaySuccess(false);
      setDisplayWarning(true);
    }
  }
  return (
    <div className="card mt-3">
      <div className="card-header">Ask question to Luv 2 Read Admin</div>
      <div className="card-body">
        <form method="POST">
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              All fields must be filled out
            </div>
          )}

          {displaySuccess && (
            <div className="alert alert-success" role="alert">
              Question added successfully
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={submitMessage}
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
