import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const links = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Privacy Policy", to: "/privacy" },
];

const Footer = () => {
  return (
    <footer className="flex flex-col p-4 gap-4 rounded-md bg-primary w-full h-auto text-primary-foreground">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex flex-wrap justify-center gap-4 md:mb-0">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="text-xs hover:text-primary-highlight focus:text-primary-highlight outline-none transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-4">
          <a
            href="https://github.com/Dyastin-0/filmpin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-highlight outline-none transition-all duration-300 focus:scale-110"
          >
            <FontAwesomeIcon size="lg" icon={faGithub} />
          </a>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1">
        <p className="text-xs">Data provided by</p>
        <a
          href="https://themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="outline-none transition-all duration-300"
        >
          <img
            src="./tmdb-logo.png"
            alt="The Movie Database logo"
            className="h-[12px]"
          />
        </a>
      </div>
      <div className="flex justify-center">
        <p className="text-xs">
          <i>
            Filmpin uses the TMDb API but is not endorsed or certified by TMDb.
          </i>
        </p>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} Filmpin. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
