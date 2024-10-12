import {
  CircularProgress as Progress,
  CircularProgressLabel,
} from "@chakra-ui/react";

const CircularProgess = ({ value }) => {
  return (
    <div className="flex w-fit justify-center items-center">
      <Progress
        size="40px"
        color="var(--highlight)"
        trackColor="var(--bg-primary)"
        value={value}
        max={10}
      >
        <CircularProgressLabel>{value}</CircularProgressLabel>
      </Progress>
    </div>
  );
};

export default CircularProgess;
