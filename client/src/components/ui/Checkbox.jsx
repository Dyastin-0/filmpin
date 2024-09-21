import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

const Checkbox = ({ name, onChecked, value = false }) => {
  return (
    <button
      className="flex w-fit pl-2 pr-2 pt-1 pb-1 gap-1 rounded-md justify-center items-center	
			bg-secondary text-primary-foreground shadow-sm outline-none
			hover:cursor-pointer focus:shadow-[var(--accent)_0_0_0_1px]"
      onClick={onChecked}
    >
      <div
        className={`flex justify-center items-center rounded-sm pr-1 pl-1 h-3.5 w-3.5
				transition-all duration-300
				${value ? "bg-secondary" : "bg-accent"}`}
      >
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: value ? 1 : 0 }}
        >
          <FontAwesomeIcon className="text-xs" size="xs" icon={faCheck} />
        </motion.div>
      </div>
      <p className="text-xs text-primary-foreground">{name}</p>
    </button>
  );
};

export default Checkbox;
