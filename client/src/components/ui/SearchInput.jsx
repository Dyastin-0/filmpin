import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const SearchInput = ({
  onChange,
  type,
  value,
  id,
  placeholder,
  required,
  onSubmit,
  onClick,
  onBlur,
  onKeyDown,
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <form
      className={`flex gap-2 max-w-full text-primary-foreground bg-secondary pt-1 pb-1 pl-3 pr-3 rounded-full
			transition-all duration-300
			${focus ? "shadow-[0_0_0_2px] shadow-secondary-accent" : "shadow-sm"}`}
      onSubmit={onSubmit}
      onClick={onClick}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <button
        type="submit"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="outline-none"
      >
        <FontAwesomeIcon
          className={`transition-all duration-300 ease-in-out hover:scale-110 hover:text-primary-highlight
					${focus ? "text-primary-highlight scale-110" : ""}`}
          icon={faSearch}
        />
      </button>
      <input
        value={value}
        id={id}
        type={type}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="bg-transparent text-primary-foreground placeholder-secondary-foreground rounded-md text-xs outline-none
					w-full"
      />
    </form>
  );
};

export default SearchInput;
