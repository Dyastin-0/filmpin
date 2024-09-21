import { motion } from "framer-motion";
import { blinkOpacity } from "../../configs/motionConfig";

export const MovieSlugLoader = () => {
  return (
    <div className="flex flex-col w-full items-center">
      <motion.div
        variants={blinkOpacity}
        animate="blink"
        className="w-full h-[400px] bg-secondary rounded-md overflow-hidden"
      ></motion.div>
      <motion.div
        initial={{ y: -120 }}
        className="flex md:flex-row flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4"
      >
        <div className="flex flex-col gap-3 items-center">
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary w-[168px] h-[250px]"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[31px] w-[80px]"
          ></motion.div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="rounded-md bg-secondary h-[10px] w-[100px]"></div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[30px] w-[400px] max-w-full"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[13px] w-full"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[13px] w-full"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[13px] w-full"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[13px] w-full"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[13px] w-full"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[13px] w-1/2"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[10px] w-[30px]"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[10px] w-[100px]"
          ></motion.div>
          <motion.div
            variants={blinkOpacity}
            animate="blink"
            className="rounded-md bg-secondary h-[10px] w-[40px]"
          ></motion.div>
        </div>
      </motion.div>
    </div>
  );
};
