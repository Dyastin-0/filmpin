import { Navigation, Pagination } from 'swiper/modules';

export const swiperConfig = {
  speed: 1000,
  loop: true,
  spaceBetween: 14,
  centeredSlides: true,
  slidesPerView: 'auto',
  navigation: true,
  modules: [Navigation],
  className: 'swiper-slide',
};

export const swiperGridConfig = {
  speed: 1000,
  loop: true,
  spaceBetween: 14,
  centeredSlides: true,
  slidesPerView: 1,
  pagination: {
    clickable: true
},
  modules: [Pagination],
};