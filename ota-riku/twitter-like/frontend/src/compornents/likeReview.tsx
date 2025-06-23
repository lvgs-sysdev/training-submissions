import { count } from "console";
import React, { FC } from "react";
import { Reaction } from "../types/Reaction";

export const LikeReview: FC<Reaction> = (props) => {
  const { reaction, count, onImgPath, offImgPath } = props;
  const mainContainer = {
    width: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: "20px",
  } as React.CSSProperties;

  const likeButton = {
    background: "transparent",
    border: "none",
    outLine: "none",
    boxShadow: "none",
  } as React.CSSProperties;

  const likeImg = {
    width: "20px",
    height: "20px",
  } as React.CSSProperties;

  const likeNum = {
    margin: "0",
    color: "white",
  } as React.CSSProperties;

  const imgPath = reaction ? onImgPath : offImgPath;
  return (
    <>
      <div style={mainContainer}>
        <button style={likeButton}>
          <img
            style={likeImg}
            src={`${process.env.PUBLIC_URL}/images/${imgPath}`}
          ></img>
        </button>
        <p style={likeNum}>{count}</p>
      </div>
    </>
  );
};
