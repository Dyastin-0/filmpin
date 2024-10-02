import UserList from "../UserList";
import { fetchUserList } from "../../helpers/api";
import { useAuth } from "../../hooks/useAuth";
import useSWR from "swr";
import useAxios from "../../hooks/useAxios";
import { LoadingMovieSection } from "../loaders/MovieLoaders";

const HomeListSection = () => {
  const { isAxiosReady, api } = useAxios();
  const { user } = useAuth();

  const { data: list, isLoading } = useSWR(
    isAxiosReady ? `/lists?owner=${user._id}` : null,
    () => fetchUserList(api, user._id)
  );

  if (isLoading) return <LoadingMovieSection title="Your lists" />;

  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex w-fit justify-center items-center gap-2">
        <h1 className="h-fit text-primary-foreground text-sm font-semibold">
          Your Lists
        </h1>
      </div>
      <div className="flex flex-wrap w-full gap-4">
        {list?.length > 0 &&
          list.map((item) => <UserList key={item._id} list={item} />)}
      </div>
    </section>
  );
};

export default HomeListSection;
