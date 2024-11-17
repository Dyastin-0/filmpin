import { Helmet } from "react-helmet";
import { Filmpin } from "../components/Filmpin";

const info = [
  "Filmpin is a movie and TV show database that provides information about the latest releases, upcoming titles, and popular content; powered by TMDb API. Our platform is designed to help you discover new films and shows, explore different genres, and stay up-to-date with the entertainment industry.",
  "At Filmpin, you can search for movies, TV shows, and people. You can also create and share lists, rate and review titles, and keep track of your favorite content. Our goal is to provide you with a seamless experience that caters to your needs and preferences.",
  "Our dedicated team is constantly improving and expanding our platform to ensure you have access to the best content. Whether you're a casual viewer or a cinephile, Filmpin is here for you.",
];

const About = () => {
  return (
    <div className="flex flex-col items-center p-4 gap-2 w-full h-full bg-primary rounded-md">
      <Helmet>
        <title>About</title>
      </Helmet>
      <div className="flex justify-center items-center w-full rounded-md">
        <img
          className="h-[500px] w-full object-cover rounded-md"
          src="https://image.tmdb.org/t/p/original//1Jpkm9qZcsT0mSyVXgs4VlGjPNI.jpg"
          alt="About Us"
        />
      </div>
      <div className="flex text-md font-semibold">
        What is {"  "}
        <Filmpin />
        {"?"}
      </div>
      <div className="flex flex-col items-center gap-2 w-full rounded-md text-xs text-primary-foreground">
        {info.map((text, index) => (
          <p key={index} className="md:w-[400px] sm:w-full lg:w-[500px]">
            {text}
          </p>
        ))}
        <a
          className="p-2 text-xs font-semibold bg-secondary rounded-md outline-none transition-all duration-300 focus:shadow-[var(--accent-secondary)_0_0_0_2px] hover:shadow-[var(--accent-secondary)_0_0_0_2px]"
          href="mailto:support@filmpin.dyastin.tech"
        >
          Contact Us
        </a>
        support@filmpin.dyastin.tech
      </div>
    </div>
  );
};

export default About;
