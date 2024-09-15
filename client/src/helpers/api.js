export const fetchOwner = async (api, id) => {
  const response = await api.get(`/public/account?id=${id}`);
  return response.data.user;
};

export const fetchList = async (api, id) => {
  const response = await api.get(`/list/${id}`);
  return response.data;
};

export const fetchMovie = async (api, id) => {
  const response = await api.get(`/movies/details?movie_id=${id}`);
  return response.data;
};

export const fetchShow = async (api, id) => {
  const response = await api.get(`/tvshows/details?show_id=${id}`);
  return response.data;
};