import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PDBLSSIWermj4YEABZaDWtHzuN1TPtR84d15gsUvSsyya2gkls20FXmt5p9NX7k0f1vwgpVwUU9hytxAFuuPCGo00HPUjHzmY"
);

ReactDOM.render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>,
  document.getElementById("root")
);
