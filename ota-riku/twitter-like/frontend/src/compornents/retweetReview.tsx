import React, { FC } from "react";
import { Reaction } from "../types/Reaction";

export const RetweetReview: FC<Reaction> = (props) => {
  const { reaction, count, onImgPath, offImgPath } = props;
  const mainContainer = {
    width: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: "20px",
  } as React.CSSProperties;

  const rtButton = {
    background: "transparent",
    border: "none",
    outLine: "none",
    boxShadow: "none",
  } as React.CSSProperties;

  const rtImg = {
    width: "20px",
    height: "20px",
  } as React.CSSProperties;

  const rtNum = {
    margin: "0",
    color: "white",
  } as React.CSSProperties;

  const imgPath = reaction ? onImgPath : offImgPath;
  return (
    <>
      <div style={mainContainer}>
        <button style={rtButton}>
          <img
            style={rtImg}
            src={`${process.env.PUBLIC_URL}/images/${imgPath}`}
          ></img>
        </button>
        <p style={rtNum}>{count}</p>
      </div>
    </>
  );
};
