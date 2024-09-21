import { motion } from "framer-motion";

const ProgressBar = ({ value, text, visible }) => {
  return (
    <motion.div
      initial={{
        height: 0,
        opacity: 0,
      }}
      animate={{
        height: visible ? "fit-content" : 0,
        opacity: visible ? 1 : 0,
      }}
      className="flex flex-col items-end w-full overflow-hidden"
    >
      <progress
        className="progress-bar w-full"
        value={value}
        max="100"
      ></progress>
      <h6 className="text-xs">{text}</h6>
    </motion.div>
  );
};

export default ProgressBar;
