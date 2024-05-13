import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { Spinner } from "../utils/spinner";
import { StarsReview } from "../utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {
  const { oktaAuth, authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [iscurrentLoansCount, setIsCurrentLoansCount] = useState(true);

  const [isBookCheckedOut, setIsBookCheckedOut] = useState(false);
  const [isBookCheckedOutLoading, setIsBookCheckedOutLoading] = useState(true);

  const [isUserLeftReview, setIsUserLeftReview] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
  const [displayError, setDisplayError] = useState(false);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API_URL}/books/${bookId}`;
      const response = await fetch(baseUrl);

      if (!response.ok) throw new Error(`Something went wrong!`);

      const data = await response.json();
      const loadedBook: BookModel = {
        id: data.id,
        title: data.title,
        author: data.author,
        description: data.description,
        copies: data.copies,
        copiesAvailable: data.copiesAvailable,
        category: data.category,
        img: data.img,
      };

      setBook(loadedBook);
      setIsLoading(false);
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isBookCheckedOut]);

  useEffect(() => {
    const fetchReviews = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API_URL}/reviews/search/findByBookId?bookId=${bookId}`;
      const response = await fetch(baseUrl);

      if (!response.ok) throw new Error(`Something went wrong!`);

      const responseJson = await response.json();
      const data = responseJson._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];
      let weightedStarReviews: number = 0;

      for (const key in data) {
        loadedReviews.push({
          id: data[key].id,
          userEmail: data[key].userEmail,
          date: data[key].date,
          rating: data[key].rating,
          bookId: data[key].bookId,
          reviewDescription: data[key].reviewDescription,
        });
        weightedStarReviews += data[key].rating;
      }

      if (loadedReviews) {
        const round =
          loadedReviews.length > 0
            ? (
                Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
              ).toFixed(1)
            : 0;
        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };
    fetchReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isUserLeftReview]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API_URL}/review/secure/user/book?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error("Something went wrong review book");
        }

        const userReviewJson = await userReview.json();
        setIsUserLeftReview(userReviewJson);
      }
      setIsLoadingUserReview(false);
    };

    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [authState]);

  useEffect(() => {
    const fetchCurrentLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API_URL}/books/secure/currentLoans/count`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok)
          throw new Error(`Something went wrong in loans count`);
        const currentLoansCountJson = await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountJson);
      }
      setIsCurrentLoansCount(false);
    };
    fetchCurrentLoansCount().catch((error: any) => {
      setIsCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [authState, isBookCheckedOut]);

  useEffect(() => {
    const fetchUserBookCheckedOut = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API_URL}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const isBookCheckedOutResponse = await fetch(url, requestOptions);
        if (!isBookCheckedOutResponse.ok)
          throw new Error(`Something went wrong in loans count`);
        const isBookCheckedOutJson = await isBookCheckedOutResponse.json();
        setIsBookCheckedOut(isBookCheckedOutJson);
      }
      setIsBookCheckedOutLoading(false);
    };
    fetchUserBookCheckedOut().catch((error: any) => {
      setIsBookCheckedOutLoading(false);
      setHttpError(error.message);
    });
  }, [authState]);

  if (
    isLoading ||
    isLoadingReview ||
    iscurrentLoansCount ||
    isBookCheckedOutLoading ||
    isLoadingUserReview
  ) {
    return <Spinner />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
  async function checkoutBook() {
    const url = `${process.env.REACT_APP_API_URL}/books/secure/checkout?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const bookCheckOutResponse = await fetch(url, requestOptions);
    if (!bookCheckOutResponse.ok) {
      const bookCheckOutJson = await bookCheckOutResponse.json();
      if (bookCheckOutJson.message.includes("Outstanding fees")) {
        setDisplayError(true);
      } else {
        throw new Error(`Something went wrong in book checkout!`);
      }
    } else {
      setDisplayError(false);
      setIsBookCheckedOut(true);
    }
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );

    const url = `${process.env.REACT_APP_API_URL}/review/secure/postReview`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };

    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error("Something Went wrong in form submit!");
    }
    setIsUserLeftReview(true);
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        {displayError && (
          <div className="alert alert-danger mt-3" role="alert">
            Please pay outstanding fees and/or return late book(s)
          </div>
        )}
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book.img} width="226" height="349" alt="book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>

          <CheckoutAndReviewBox
            book={book}
            currentLoansCount={currentLoansCount}
            isBookCheckedOut={isBookCheckedOut}
            isAuthenticated={authState?.isAuthenticated}
            isUserLeftReview={isUserLeftReview}
            submitReview={submitReview}
            checkoutBook={checkoutBook}
            mobile={false}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>

      <div className="container d-lg-none mt-5">
        {displayError && (
          <div className="alert alert-danger mt-3" role="alert">
            Please pay outstanding fees and/or return late book(s)
          </div>
        )}
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book.img} width="226" height="349" alt="book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          currentLoansCount={currentLoansCount}
          isBookCheckedOut={isBookCheckedOut}
          isAuthenticated={authState?.isAuthenticated}
          isUserLeftReview={isUserLeftReview}
          checkoutBook={checkoutBook}
          submitReview={submitReview}
          mobile={true}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
