import React from "react";
import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Homepage } from "./layouts/Homepage/Hompage";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBookPage";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { BookCheckoutPage } from "./layouts/BookCheckout/BookCheckoutPage";
import { oktaConfig } from "./lib/oktaConfig";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { LoginCallback, SecureRoute, Security } from "@okta/okta-react";
import LoginWidget from "./Auth/LoginWidget";
import { ReviewListPage } from "./layouts/ReviewList/ReviewListPage";
import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";
import { MessagesPage } from "./layouts/MessagePage/MessagesPage";
import { ManageLibraryPage } from "./layouts/ManageLibraryPage/ManageLibraryPage";
import { PaymentPage } from "./layouts/PaymentPage/PaymentPage";

const oktaAuth = new OktaAuth(oktaConfig);
function App() {
  const customAuthHandler = () => {
    history.push("/login");
  };
  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={restoreOriginalUri}
        onAuthRequired={customAuthHandler}
      >
        <Navbar />
        <div className="flex-grow-1">
          {/* helps to switch between one route */}
          <Switch>
            <Route path="/" exact>
              <Redirect to={"/home"}></Redirect>
            </Route>
            <Route path="/home">
              <Homepage />
            </Route>
            <Route path="/search">
              <SearchBooksPage />
            </Route>
            <Route path="/reviewList/:bookId">
              <ReviewListPage />
            </Route>
            <Route path="/checkout/:bookId">
              <BookCheckoutPage />
            </Route>
            <Route
              path="/login"
              render={() => <LoginWidget config={oktaConfig} />}
            ></Route>
            <Route path="/login/callback" component={LoginCallback} />
          </Switch>
          <SecureRoute path={"/shelf"}>
            <ShelfPage />
          </SecureRoute>

          <SecureRoute path={"/messages"}>
            <MessagesPage />
          </SecureRoute>
          <SecureRoute path={"/admin"}>
            <ManageLibraryPage />
          </SecureRoute>
          <SecureRoute path={"/fees"}>
            <PaymentPage />
          </SecureRoute>
        </div>
        <Footer />
      </Security>
    </div>
  );
}

export default App;
