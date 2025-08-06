import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About Us",
};
const AboutUs: React.FC = () => {
  return (
    <>
      <section
        id="home"
        className="flex-1 flex flex-col-reverse md:flex-row items-center justify-between px-6 sm:px-10 md:px-16 py-12 bg-white dark:bg-gray-800"
      >
        <div className="md:w-1/2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold dark:text-white text-black mb-4">
            Hello, I’m Achraf abdeslami{" "}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-medium dark:text-gray-300 text-gray-600">
            Freelance UI Designer, Fullstack Developer, & Data Miner. I create
            seamless web experiences for end-users.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
          <img
            src="https://c0.wallpaperflare.com/preview/692/415/725/business-portrait-glasses-style.jpg"
            alt="Business person wearing glasses"
            className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-indigo-500 object-cover"
          />
        </div>
      </section>

      <section
        id="about"
        className="px-6 sm:px-10 md:px-16 py-12 bg-white dark:bg-gray-800"
      >
        <h2 className="text-indigo-500 text-3xl sm:text-4xl font-semibold mb-6 ">
          About Me
        </h2>
        <p className="text-lg sm:text-xl font-medium  dark:text-white text-black ">
          Hi, my name is Achraf abdeslami, a Fullstack Web Developer, UI
          Designer, and Mobile Developer. I have honed my skills in Web
          Development and advanced UI design principles, enabling me to create
          intuitive and visually appealing applications.
        </p>
      </section>

      <section
        id="services"
        className="px-6 sm:px-10 md:px-16 py-12 bg-white dark:bg-gray-800"
      >
        <h2 className="text-indigo-500 text-3xl sm:text-4xl font-semibold mb-6">
          The Services I Offer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* <!-- Service 1 --> */}
          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-6 flex flex-col items-center text-center">
            <i className="fas fa-paint-brush text-indigo-500 text-3xl mb-4"></i>
            <h3 className="text-black dark:text-white text-2xl font-semibold mb-2">
              UI & UX Designing
            </h3>
            <p className="text-black dark:text-white text-base">
              I design beautiful web interfaces with Figma and Adobe XD.
            </p>
          </div>
          {/* <!-- Service 2 --> */}
          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-6 flex flex-col items-center text-center">
            <i className="fas fa-code text-indigo-500 text-3xl mb-4"></i>
            <h3 className="text-black dark:text-white text-2xl font-semibold mb-2">
              Web Development
            </h3>
            <p className="text-black dark:text-white text-base">
              I create stunning interfaces using HTML, CSS, JavaScript, and
              frameworks like Angular and ReactJS.
            </p>
          </div>
          {/* <!-- Service 3 --> */}
          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-6 flex flex-col items-center text-center">
            <i className="fas fa-mobile-alt text-indigo-500 text-3xl mb-4"></i>
            <h3 className="text-black dark:text-white text-2xl font-semibold mb-2">
              Mobile Development
            </h3>
            <p className="text-black dark:text-white text-base">
              Expert in Flutter and React Native to build cross-platform mobile
              applications.
            </p>
          </div>
          {/* <!-- Service 4 --> */}
          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-6 flex flex-col items-center text-center">
            <i className="fas fa-database text-indigo-500 text-3xl mb-4"></i>
            <h3 className="text-black dark:text-white text-2xl font-semibold mb-2">
              Web Scraping with Python
            </h3>
            <p className="text-black dark:text-white text-base">
              I can collect and manipulate content from the web using Python.
            </p>
          </div>
        </div>
      </section>

      {/* <!-- Featured Projects Section --> */}
      <section
        id="projects"
        className="px-6 sm:px-10 md:px-16 py-12 bg-white dark:bg-gray-800"
      >
        <h2 className="text-indigo-500 text-3xl sm:text-4xl font-semibold mb-6">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* <!-- Project 1 --> */}
          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-6 flex flex-col">
            <img
              src="https://via.placeholder.com/311x173"
              alt="Twinder"
              className="rounded-lg mb-4 object-cover h-48"
            />
            <h3 className="text-indigo-500 text-2xl font-semibold mb-2">
              Twinder
            </h3>
            <p className="text-black dark:text-white text-lg flex-grow">
              A live Geolocation app for finding tweets and Twitter users around
              you.
            </p>
            <a
              href="#"
              className="text-indigo-500 mt-4 font-semibold hover:underline"
            >
              View Live
            </a>
          </div>
          {/* <!-- Project 2 --> */}
          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-6 flex flex-col">
            <img
              src="https://via.placeholder.com/311x173"
              alt="LIVENTS"
              className="rounded-lg mb-4 object-cover h-48"
            />
            <h3 className="text-indigo-500 text-2xl font-semibold mb-2">
              LIVENTS
            </h3>
            <p className="text-black dark:text-white text-lg flex-grow">
              A video streaming app with live Geolocation for streaming events.
            </p>
            <a
              href="#"
              className="text-indigo-500 mt-4 font-semibold hover:underline"
            >
              View Live
            </a>
          </div>
          {/* <!-- Project 3 --> */}
          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-6 flex flex-col">
            <img
              src="https://via.placeholder.com/311x173"
              alt="Moove"
              className="rounded-lg mb-4 object-cover h-48"
            />
            <h3 className="text-indigo-500 text-2xl font-semibold mb-2">
              Moove
            </h3>
            <p className="text-black dark:text-white text-lg flex-grow">
              Mobile app for booking instant pickup & drop-off across major
              cities.
            </p>
            <a
              href="#"
              className="text-indigo-500 mt-4 font-semibold hover:underline"
            >
              View Live
            </a>
          </div>
        </div>
      </section>

      {/* <!-- Contact Section --> */}
      <section
        id="contact"
        className="px-6 sm:px-10 md:px-16 py-12 bg-white dark:bg-gray-800"
      >
        <h2 className="text-indigo-500 text-3xl sm:text-4xl font-semibold text-center mb-6">
          Connect with Me
        </h2>
        <p className=" dark:text-white text-black  text-lg text-center mb-8">
          Contact me, let's make magic together
        </p>
        <form className="max-w-2xl mx-auto space-y-6">
          <input
            type="text"
            placeholder="Name"
            required
            className="w-full p-4 rounded-lg dark:bg-gray-700  bg-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-4 rounded-lg dark:bg-gray-700  bg-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Message"
            required
            className="w-full p-4 rounded-lg dark:bg-gray-700  bg-gray-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-400 dark:bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
          >
            Send
          </button>
        </form>
      </section>
    </>
  );
};
export default AboutUs;
