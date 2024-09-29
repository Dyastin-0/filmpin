import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link as DomLink, useLocation } from "react-router-dom";

const Link = ({ path, icon, name }) => {
  const location = useLocation();

  return (
    <DomLink
      to={path}
      className={`text-lg text-center font-semibold
			transition-all duration-300
			${path === location.pathname ? "text-primary-highlight" : "text-primary-foreground"}`}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      <span className="text-xs">{name}</span>
    </DomLink>
  );
};

export default Link;
