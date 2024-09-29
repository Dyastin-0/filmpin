import { motion } from "framer-motion";
import { Link as DomLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import Link from "../components/Link";

const variants = {
  open: { x: 0, opacity: 1 },
  closed: { x: "-100%", opacity: 0 },
};

const SideNavbar = ({ isOpen, toggle, routes, authRoutes }) => {
  const { token } = useAuth();

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-0 left-0 h-full w-[200px] bg-accent rounded-md text-primary-foreground z-50"
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
                key={index}
                path={route.path}
                icon={route.icon}
                name={route.name}
              />
            ))
          : authRoutes.map((route, index) => (
              <Link
                key={index}
                path={route.path}
                icon={route.icon}
                name={route.name}
              />
            ))}
      </ul>
    </motion.div>
  );
};

export default SideNavbar;
