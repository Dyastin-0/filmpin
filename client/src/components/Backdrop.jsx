import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import { useModal } from "./hooks/useModal";
import { useToast } from "./hooks/useToast";

export const Backdrop = ({ backdrop_path, title }) => {
  const { setOpen } = useModal();
  const { api } = useAxios();
  const { user, setUser } = useAuth();
  const { toastError, toastInfo } = useToast();

  const handleSetBackdrop = async (backdrop_path) => {
    try {
      const response = await api.post(
        `/account/set-backdrop?user_id=${user._id}&backdrop_path=${backdrop_path}`
      );
      const backdrop = response.data.backdropPath;
      setUser((prev) => ({
        ...prev,
        backdropPath: backdrop,
      }));
      toastInfo("Backdrop updated.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to set backdrop.", error);
      toastError("Failed to update backdrop.");
    }
  };

  return (
    <div
      className="flex flex-col gap-2 transition-all duration-300 hover:cursor-pointer"
      onClick={() => handleSetBackdrop(backdrop_path)}
    >
      <img
        loading="lazy"
        className="w-[300px] h-[150px] object-cover rounded-md"
        src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
        alt={`${title} backdrop`}
      />
      <h1 className="text-center text-primary-foreground text-xs font-semibold line-clamp-1 text-ellipsis">
        {title}
      </h1>
    </div>
  );
};
