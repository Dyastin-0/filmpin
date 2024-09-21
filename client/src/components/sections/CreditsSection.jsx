import Cast from "../Cast";
import Crew from "../Crew";

const CreditsSection = ({ credits }) => {
  return (
    <>
      <h1 className="text-primary-foreground text-xs font-semibold">
        Director
      </h1>
      {credits?.crew
        .filter((crew) => crew.job === "Director")
        .map((crew, index) => (
          <Crew info={crew} key={index} />
        ))}
      {credits?.crew.filter((crew) => crew.job === "Writer").length > 0 && (
        <>
          <h1 className="text-primary-foreground text-xs font-semibold">
            Writer
          </h1>
          <div className="flex flex-wrap gap-4">
            {credits?.crew
              .filter((crew) => crew.job === "Writer")
              .map((writer, index) => (
                <Crew info={writer} key={index} />
              ))}
          </div>
        </>
      )}
      <h1 className="text-primary-foreground text-xs font-semibold">
        Popular cast
      </h1>
      <div className="flex flex-wrap gap-4">
        {credits?.cast.slice(0, 1).map((cast, index) => (
          <Cast info={cast} key={index} />
        ))}
      </div>
    </>
  );
};

export default CreditsSection;
