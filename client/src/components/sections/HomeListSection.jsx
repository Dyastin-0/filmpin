import UserList from "../UserList";
import { fetchUserList } from "../../helpers/api";
import { useAuth } from "../../hooks/useAuth";
import useSWR from "swr";
import useAxios from "../../hooks/useAxios";
import { LoadingMovieSection } from "../loaders/MovieLoaders";
import { Swiper, SwiperSlide } from "swiper/react";
import { swiperConfig } from "../../configs/swiperConfig";

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
      <div className="flex flex-wrap justify-start w-full gap-4">
        <Swiper {...swiperConfig}>
          {list?.length > 0 &&
            list.map((item, index) => (
              <SwiperSlide key={index}>
                <UserList key={item._id} list={item} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeListSection;
