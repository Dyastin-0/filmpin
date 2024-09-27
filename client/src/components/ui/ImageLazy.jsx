const ImageLazy = ({ imagePath, name }) => {
  return (
    <img
      loading="lazy"
      className="w-full h-full object-cover rounded-md"
      src={`https://image.tmdb.org/t/p/original/${imagePath}`}
      alt={`${name} backdrop`}
    />
  );
};

export default ImageLazy;
