import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const variants = {
  open: { x: 0, opacity: 1 },
  closed: { x: "-100%", opacity: 0 },
};

const SideNavbar = ({ isOpen, toggle, routes, authRoutes, token }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-full w-[200px] bg-primary text-primary-foreground z-50"
    >
      <div className="text-xs p-4 flex justify-between">
        <Link className="outline-none" to="/">
          <div className="flex justify-center items-center h-full font-semibold">
            <h1 className="text-md text-primary-highlight">Film</h1>
            <h1 className="text-md text-primary-foreground">pin</h1>
          </div>
        </Link>
        <FontAwesomeIcon
          icon={faX}
          onClick={toggle}
          className="hover:cursor-pointer"
        />
      </div>
      <ul className="flex flex-col p-4 gap-4">
        {token
          ? routes.map((route, index) => (
              <Button
                key={index}
                onClick={() => {
                  navigate(route.path);
                  toggle();
                }}
                variant="link"
                text={route.name}
                className={`${
                  route.path === location.pathname
                    ? "text-primary-highlight shadow-[var(--highlight)_0_1px_0_0]"
                    : ""
                }`}
              />
            ))
          : authRoutes.map((route, index) => (
              <Button
                key={index}
                onClick={() => {
                  navigate(route.path);
                  toggle();
                }}
                variant="link"
                text={route.name}
                className={`${
                  route.path === location.pathname
                    ? "text-primary-highlight shadow-[var(--highlight)_0_1px_0_0]"
                    : ""
                }`}
              />
            ))}
      </ul>
    </motion.div>
  );
};

export default SideNavbar;
