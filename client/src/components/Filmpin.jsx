import { Link } from "react-router-dom";

export const Filmpin = () => {
  return (
    <Link className="outline-none ml-1" to="/">
      <div className="flex justify-center items-center h-full font-semibold">
        <h1 className="text-md text-primary-highlight">Film</h1>
        <h1 className="text-md text-primary-foreground">pin</h1>
      </div>
    </Link>
  );
};
