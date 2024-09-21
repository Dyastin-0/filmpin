import { motion } from "framer-motion";
import { blinkVariants } from "../../configs/motionConfig";

const BackdropLoader = () => {
  return (
    <motion.div
      className="w-full h-[400px] rounded-md overflow-hidden"
      variants={blinkVariants}
      animate="blink"
    ></motion.div>
  );
};

export default BackdropLoader;
