export const Image = ({ imageURL, name }) => {
  return (
    <div className="w-full h-full max-w-full max-h-full">
      <img
        className="rounded-md w-full h-full object-contain"
        src={imageURL}
        alt={`${name} profile image`}
      />
    </div>
  );
};
