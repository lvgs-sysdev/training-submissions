import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";

const Error: React.FC = () => {
  const { state } = useLocation();
  useTitle("エラー");

  if (state?.statusCode || state?.message) {
    return (
      <>
        <div className="flex  items-center justify-center p-5 w-full">
          <div className="text-center">
            <div className="inline-flex rounded-full bg-red-100 p-4">
              <div className="rounded-full stroke-red-600 bg-red-200 p-4">
                <svg
                  className="w-16 h-16"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 8H6.01M6 16H6.01M6 12H18C20.2091 12 22 10.2091 22 8C22 5.79086 20.2091 4 18 4H6C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12ZM6 12C3.79086 12 2 13.7909 2 16C2 18.2091 3.79086 20 6 20H14"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M17 16L22 21M22 16L17 21"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
            </div>
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              {state?.statusCode || null}
            </h1>
            <p className="text-slate-600 mt-5 lg:text-lg">{state?.message}</p>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {/* 404 Not Found */}
        <div className="text-center animate-fadeIn py-4">
          <img
            src="https://yemca-services.net/404.png"
            alt="404 Illustration"
            className="mx-auto w-80 animate-[float_3s_infinite] shadow-xl rounded-lg"
          />
          <h1 className="text-7xl font-extrabold text-blue-700 mt-6">
            Looks Like You're Lost!
          </h1>
          <p className="text-xl text-gray-700 mt-2">
            We can't seem to find the page you're looking for.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform transition hover:scale-105 hover:bg-blue-700"
          >
            Return Home
          </Link>
        </div>
      </>
    );
  }
};
export default Error;
