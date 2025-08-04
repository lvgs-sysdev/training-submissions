"use client";
import { useEffect } from "react";

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = "レバブラリー | " + title;
  }, [title]); // titleが変更されるたびに実行
};
