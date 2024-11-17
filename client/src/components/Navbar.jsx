import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Button from "./ui/Button";
import { Dropdown, DropdownItem } from "./ui/Dropdown";
import { useThemeToggle } from "../hooks/useTheme";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faGear,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { routes, authRoutes } from "../helpers/routes";
import Link from "./Link";
import { Link as DomLink } from "react-router-dom";
import { Filmpin } from "./Filmpin";
import Search from "./Search";
import useViewport from "../hooks/useViewport";

const Navbar = ({ toggleSideNavbar }) => {
  const navigate = useNavigate();
  const { toggleTheme, icon } = useThemeToggle();
  const { setToken, token, setUser, user } = useAuth();
  const { viewWidth } = useViewport();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleSignout = async () => {
    try {
      await axios.post("/auth/sign-out");
      setToken(null);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      className={`sticky top-4 flex justify-between rounded-lg w-full p-3 gap-3 shadow-sm z-40 bg-primary
      ${lastScrollY > 50 ? "border border-secondary-accent" : ""}`}
      initial={{ y: 0 }}
      animate={isScrollingDown ? { y: -100 } : { y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="flex justify-center items-center gap-2">
        {viewWidth <= 768 && (
          <FontAwesomeIcon
            icon={faBars}
            onClick={toggleSideNavbar}
            className="hover:cursor-pointer"
          />
        )}
        {viewWidth > 768 && <Filmpin />}
      </div>
      <div className="flex w-full justify-center items-center gap-3">
        {token &&
          viewWidth > 768 &&
          routes.map((route, index) => (
            <Link key={index} path={route.path} icon={route.icon} />
          ))}
        {!token &&
          viewWidth > 768 &&
          authRoutes.map((route, index) => (
            <Link
              key={index}
              path={route.path}
              name={route.name}
              icon={route.icon}
            />
          ))}
        {token && <Search isScrollingDown={isScrollingDown} />}
      </div>
      <div className="flex w-fit gap-3 justify-center items-center">
        <Button
          variant="default_rounded"
          icon={icon}
          onClick={toggleTheme}
          className="p-2"
        />
        {token && (
          <Dropdown
            name={
              user.profileImageURL ? (
                <img
                  loading="lazy"
                  src={user.profileImageURL}
                  className="max-w-[30px] max-h-[30px] object-cover aspect-square rounded-full"
                />
              ) : (
                <div
                  className="flex justify-center items-center w-[30px] h-[30px] rounded-full bg-secondary
                font-semibold text-primary-highlight text-xs"
                >
                  {user.username[0]}
                </div>
              )
            }
          >
            <DropdownItem asChild={true}>
              <DomLink
                to={`/${user.username}`}
                className="flex p-2 text-xs text-primary-foreground outline-none rounded-md
                transition-all duration-300 w-full justify-end items-center
                hover:bg-secondary hover:cursor-pointer focus:bg-secondary"
              >
                Profile
                <FontAwesomeIcon size="xs" icon={faUser} className="ml-1" />
              </DomLink>
            </DropdownItem>
            <DropdownItem asChild={true}>
              <DomLink
                to="/settings"
                className="flex p-2 text-xs text-primary-foreground outline-none rounded-md
                transition-all duration-300 w-full justify-end items-center
                hover:bg-secondary hover:cursor-pointer focus:bg-secondary"
              >
                Settings
                <FontAwesomeIcon size="xs" icon={faGear} className="ml-1" />
              </DomLink>
            </DropdownItem>
            <DropdownItem onClick={handleSignout}>
              Sign out
              <FontAwesomeIcon size="xs" icon={faSignOutAlt} className="ml-1" />
            </DropdownItem>
          </Dropdown>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;
