import { motion } from "framer-motion";
import { Link as DomLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import Link from "../components/Link";
import { useEffect } from "react";
import QuickList from "./QuickList";
import { useList } from "../hooks/useList";
import SideNavbarQuickList from "./SideNavbarQuickList";
import { BreadcrumbSeparator, StepSeparator } from "@chakra-ui/react";
import Separator from "./Separator";
import useViewport from "../hooks/useViewport";

const variants = {
  open: { x: 0, opacity: 1 },
  closed: { x: "-100%", opacity: 0 },
};

const SideNavbar = ({ isOpen, close, routes, authRoutes }) => {
  const { token, user } = useAuth();
  const { viewWidth } = useViewport();
  const { list } = useList({ userData: user });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  useEffect(() => {
    if (viewWidth >= 768) {
      close();
    }
  }, [viewWidth]);

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 0.3 : 0,
          visibility: isOpen ? "visible" : "hidden",
        }}
        onClick={close}
        className="fixed inset-0 bg-black opacity-30 z-40 rounded-md"
      />
      <motion.div
        onBlur={close}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed flex gap-4 flex-col top-0 left-0 p-4 h-[calc(100vh-2rem)] w-[200px] m-4
        overflow-y-scroll scrollbar-none
        bg-primary rounded-md text-primary-foreground z-50"
      >
        <div className="sticky top-0 flex justify-between">
          <DomLink className="outline-none" to="/">
            <div className="flex justify-center items-center h-full font-semibold">
              <h1 className="text-md text-primary-highlight">Film</h1>
              <h1 className="text-md text-primary-foreground">pin</h1>
            </div>
          </DomLink>
          <FontAwesomeIcon
            icon={faX}
            size="xs"
            onClick={close}
            className="hover:cursor-pointer"
          />
        </div>
        <ul className="flex flex-col gap-2">
          {token
            ? routes.map((route, index) => (
                <Link
                  onClick={close}
                  key={index}
                  path={route.path}
                  icon={route.icon}
                  name={route.name}
                />
              ))
            : authRoutes.map((route, index) => (
                <Link
                  onClick={close}
                  key={index}
                  path={route.path}
                  icon={route.icon}
                  name={route.name}
                />
              ))}
        </ul>
        {viewWidth < 768 && (
          <>
            <Separator />
            <SideNavbarQuickList list={list} close={close} />
          </>
        )}
      </motion.div>
    </>
  );
};

export default SideNavbar;
