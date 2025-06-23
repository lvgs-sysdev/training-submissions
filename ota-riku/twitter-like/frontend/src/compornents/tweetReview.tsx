import { LikeReview } from "./likeReview";
import { RetweetReview } from "./retweetReview";
import { FC } from "react";

type TweetContents = {
  //postDate: Date;
  children: string;
};

export const TweetReview: FC<TweetContents> = (props) => {
  //const { postDate } = props;
  const reviewStyle = {
    display: "flex",
    width: "1000px",
    height: "auto",
    minHeight: "100px",
    backgroundColor: "black",
    borderTop: "1px solid gray",
    borderRadius: "3px",
  } as React.CSSProperties;

  const iconStyle = {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "50%",
    marginTop: "10px",
    marginLeft: "10px",
  } as React.CSSProperties;

  const usernameContainer = {
    height: "30px",
    padding: "10px 0 10px 0",
    alignItems: "center",
    display: "flex",
    width: "auto",
  } as React.CSSProperties;

  const usernameStyle = {
    fontSize: "20px",
    color: "white",
    margin: "0",
    textDecoration: "none",
    fontWeight: "bold",
  } as React.CSSProperties;

  const accountIdStyle = {
    fontSize: "18px",
    color: "white",
    opacity: "0.5",
    paddingLeft: "5px",
    margin: "0",
    textDecoration: "none",
  } as React.CSSProperties;

  const mainContainer = {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "10px",
    width: "100%",
  } as React.CSSProperties;

  const reactionContainer = {
    display: "flex",
    padding: "10px 10px 10px",
  };

  const contentContainer = {
    width: "95%",
    height: "auto",
    paddingBottom: "10px",
  } as React.CSSProperties;

  const contentStyle = {
    fontSize: "20px",
    fontWeight: "lighter",
    color: "white",
    margin: "0",
  } as React.CSSProperties;

  return (
    <>
      <a style={reviewStyle}>
        <img
          src={`${process.env.PUBLIC_URL}/images/cat_meam.jpg`}
          style={iconStyle}
        />
        <div style={mainContainer}>
          <div style={usernameContainer}>
            <a style={usernameStyle} href="#">
              Catmeam
            </a>
            <a style={accountIdStyle} href="#">
              @cat_meam
            </a>
          </div>
          <div style={contentContainer}>
            <h2 style={contentStyle}>{props.children}</h2>
          </div>
          <div style={reactionContainer}>
            <LikeReview
              reaction={false}
              count={10}
              onImgPath="Like.png"
              offImgPath="NoLike.png"
            />
            <RetweetReview
              reaction={false}
              count={10}
              onImgPath="OnRetweet.png"
              offImgPath="OffRetweet.png"
            />
          </div>
        </div>
      </a>
    </>
  );
};
