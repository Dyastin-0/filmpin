import { motion } from "framer-motion";
import { blinkVariants } from "../../configs/motionConfig";

export const ListBackdropDummy = () => (
  <motion.div
    variants={blinkVariants}
    animate="blink"
    className="w-full h-[400px] bg-secondary rounded-md overflow-hidden"
  ></motion.div>
);

export const ListTitleDummy = () => (
  <div className="flex flex-wrap w-full gap-4">
    <motion.div
      variants={blinkVariants}
      animate="blink"
      className="min-w-[200px] h-[260px] p-4 bg-secondary rounded-md "
    ></motion.div>
    <div className="flex flex-col justify-end gap-4">
      <motion.div
        variants={blinkVariants}
        animate="blink"
        className="w-[100px] h-[15px] bg-secondary rounded-md"
      ></motion.div>
      <motion.div
        variants={blinkVariants}
        animate="blink"
        className="w-[200px] h-[10px] bg-secondary rounded-md"
      ></motion.div>
      <motion.div
        variants={blinkVariants}
        animate="blink"
        className="w-[150px] h-[10px] bg-secondary rounded-md"
      ></motion.div>
      <motion.div
        variants={blinkVariants}
        animate="blink"
        className="w-[100px] h-[10px] bg-secondary rounded-md"
      ></motion.div>
    </div>
  </div>
);
