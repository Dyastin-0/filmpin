import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ShowPassword = ({ showPassword, setShowPassword }) => (
  <div
    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-opacity duration-200"
    onClick={() => setShowPassword(!showPassword)}
  >
    <FontAwesomeIcon
      icon={showPassword ? faEye : faEyeSlash}
      className="text-primary-foreground"
    />
  </div>
);
