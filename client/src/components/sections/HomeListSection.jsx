import UserList from "../UserList";
import { fetchUserList } from "../../helpers/api";
import { useAuth } from "../../hooks/useAuth";
import useSWR from "swr";
import useAxios from "../../hooks/useAxios";

const HomeListSection = () => {
  const { isAxiosReady, api } = useAxios();
  const { user } = useAuth();

  const { data: list } = useSWR(
    isAxiosReady ? `/lists?owner=${user._id}` : null,
    () => fetchUserList(api, user._id)
  );

  if (!list)
    return (
      <section className="flex w-full justify-center">
        <h1 className="h-fit text-primary-foreground text-sm font-semibold">
          You don't have a list yet.
        </h1>
      </section>
    );

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
