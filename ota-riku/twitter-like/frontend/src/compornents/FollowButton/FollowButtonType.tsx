import React from "react";

export type FollowButtonType = {
  children: React.ReactNode;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
};
