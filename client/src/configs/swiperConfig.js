import { Autoplay, Navigation, Pagination } from "swiper/modules";

export const swiperConfig = {
  speed: 1000,
  spaceBetween: 16,
  slidesPerView: "auto",
  navigation: true,
  loop: true,
  lazy: "true",
  modules: [Navigation],
  className: "swiper-slide",
};

export const swiperAutoPlayConfig = {
  speed: 1000,
  spaceBetween: 16,
  loop: true,
  slidesPerView: 1,
  autoplay: {
    delay: "3000",
    disableOnInteraction: false,
  },
  lazy: "true",
  modules: [Autoplay, Pagination],
  className: "swiper-slide",
};

export const swiperConfigNormal = {
  speed: 1000,
  spaceBetween: 16,
  slidesPerView: "auto",
  lazy: "true",
  className: "swiper-slide",
};
