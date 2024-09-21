import { Autoplay, Navigation, Pagination } from "swiper/modules";

export const swiperConfig = {
  speed: 1000,
  spaceBetween: 14,
  slidesPerView: "auto",
  navigation: true,
  lazy: "true",
  modules: [Navigation],
  className: "swiper-slide",
};

export const swiperAutoPlayConfig = {
  speed: 1000,
  spaceBetween: 14,
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
  spaceBetween: 14,
  slidesPerView: "auto",
  lazy: "true",
  className: "swiper-slide",
};
