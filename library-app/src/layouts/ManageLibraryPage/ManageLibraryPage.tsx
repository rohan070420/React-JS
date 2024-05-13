import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";
import { Redirect } from "react-router-dom";

export const ManageLibraryPage = () => {
  const { authState } = useOktaAuth();

  const [changeQuantityofBooksClick, setChangeQuantityofBooksClick] =
    useState(false);
  const [messagesClick, setMessagesClick] = useState(false);

  if (authState?.accessToken?.claims.userType === undefined) {
    console.log(authState?.accessToken?.claims.userType);
    return <Redirect to="/" />;
  }

  function addBookClickFunction() {
    setChangeQuantityofBooksClick(true);
    setMessagesClick(false);
  }

  function messagesClickFunction() {
    setChangeQuantityofBooksClick(false);
    setMessagesClick(true);
  }

  function changeQuantityofBooksClickFunction() {
    setChangeQuantityofBooksClick(true);
    setMessagesClick(false);
  }

  return (
    <div className="container">
      <div className="mt-5">
        <h3>Manage Library</h3>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="nav-link active"
              id="nav-add-book-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-add-book"
              type="button"
              role="tab"
              aria-controls="nav-add-book"
              aria-selected="false"
              onClick={addBookClickFunction}
            >
              Add New Book
            </button>

            <button
              className="nav-link"
              id="nav-quantity-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-quantity"
              type="button"
              role="tab"
              aria-controls="nav-quantity"
              aria-selected="false"
              onClick={changeQuantityofBooksClickFunction}
            >
              Change Quantity
            </button>
            <button
              className="nav-link"
              id="nav-messages-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-messages"
              type="button"
              role="tab"
              aria-controls="nav-messages"
              aria-selected="false"
              onClick={messagesClickFunction}
            >
              Messages
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-add-book"
            role="tabpanel"
            aria-labelledby="nav-add-book-tab"
          >
            <AddNewBook />
          </div>
          <div
            className="tab-pane fade"
            id="nav-quantity"
            role="tabpanel"
            ariaa-labelledby="nav-quantity-tab"
          >
            {changeQuantityofBooksClick && <ChangeQuantityOfBooks />}
          </div>
          <div
            className="tab-pane fade"
            id="nav-messages"
            role="tabpanel"
            ariaa-labelledby="nav-message-tab"
          >
            {messagesClick && (
              <>
                <AdminMessages />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
