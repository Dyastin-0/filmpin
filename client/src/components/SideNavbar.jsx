import { motion } from "framer-motion";
import { Link as DomLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import Link from "../components/Link";
import { useEffect } from "react";

const variants = {
  open: { x: 0, opacity: 1 },
  closed: { x: "-100%", opacity: 0 },
};

const SideNavbar = ({ isOpen, toggle, routes, authRoutes }) => {
  const { token } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 0.3 : 0,
          visibility: isOpen ? "visible" : "hidden",
        }}
        onClick={toggle}
        className="fixed inset-0 bg-black opacity-30 z-40 rounded-md"
      />
      <motion.div
        onBlur={toggle}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-[calc(100vh-2rem)] w-[180px] m-4 bg-primary rounded-md text-primary-foreground z-50"
      >
        <div className="p-4 flex justify-between">
          <DomLink className="outline-none" to="/">
            <div className="flex justify-center items-center h-full font-semibold">
              <h1 className="text-md text-primary-highlight">Film</h1>
              <h1 className="text-md text-primary-foreground">pin</h1>
            </div>
          </DomLink>
          <FontAwesomeIcon
            icon={faX}
            size="xs"
            onClick={toggle}
            className="hover:cursor-pointer"
          />
        </div>
        <ul className="flex flex-col p-4 gap-4">
          {token
            ? routes.map((route, index) => (
                <Link
                  onClick={toggle}
                  key={index}
                  path={route.path}
                  icon={route.icon}
                  name={route.name}
                />
              ))
            : authRoutes.map((route, index) => (
                <Link
                  onClick={toggle}
                  key={index}
                  path={route.path}
                  icon={route.icon}
                  name={route.name}
                />
              ))}
        </ul>
      </motion.div>
    </>
  );
};

export default SideNavbar;
