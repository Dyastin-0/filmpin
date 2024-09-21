import { motion } from "framer-motion";
import { blinkOpacity } from "../../configs/motionConfig";

export const ListBackdropDummy = () => (
  <motion.div
    variants={blinkOpacity}
    animate="blink"
    className="w-full h-[400px] bg-secondary rounded-md overflow-hidden"
  ></motion.div>
);
export const ListTitleDummy = () => (
  <div className="flex flex-col gap-4 w-full">
    <motion.div
      variants={blinkOpacity}
      animate="blink"
      className="w-[100px] h-[15px] bg-secondary rounded-md overflow-hidden"
    ></motion.div>
    <motion.div
      variants={blinkOpacity}
      animate="blink"
      className="w-[200px] h-[10px] bg-secondary rounded-md overflow-hidden"
    ></motion.div>
    <motion.div
      variants={blinkOpacity}
      animate="blink"
      className="w-[100px] h-[10px] bg-secondary rounded-md overflow-hidden"
    ></motion.div>
  </div>
);
