import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link as DomLink, useLocation } from "react-router-dom";

const Link = ({ path, icon, name, onClick }) => {
  const location = useLocation();

  return (
    <DomLink
      onClick={onClick}
      to={path}
      className={`flex items-center justify-center text-lg text-center font-semibold
      transition-all duration-300
      ${path === location.pathname ? "text-primary-highlight" : "text-primary-foreground"}`}
    >
      {icon && (
        <span className="mr-2">
          <FontAwesomeIcon icon={icon} />
        </span>
      )}
      <span className="text-xs">{name}</span>
    </DomLink>
  );
};

export default Link;
