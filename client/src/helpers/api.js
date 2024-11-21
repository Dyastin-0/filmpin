export const fetchOwner = async (axios, id) => {
  const response = await axios.get(`/public/account?id=${id}`);
  return response.data.user;
};

export const fetchList = async (api, id) => {
  const response = await api.get(`/lists/${id}`);
  return response.data;
};

export const fetchMovie = async (api, id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const fetchShow = async (api, id) => {
  const response = await api.get(`/tvshows/${id}`);
  return response.data;
};

export const fetchMovies = async (
  api,
  genres = "",
  page = "1",
  sortBy = "vote_count"
) => {
  const response = await api.get(
    `/movies/discover?genres=${genres}&sort_by=${sortBy}&page=${page}`
  );
  return response.data.results;
};

export const fetchShows = async (
  api,
  genres = "",
  page = "1",
  sortBy = "vote_count"
) => {
  const response = await api.get(
    `/tvshows/discover?genres=${genres}&sort_by=${sortBy}&page=${page}`
  );
  return response.data.results;
};

export const fetchDiscovery = async (
  api,
  target,
  genres,
  sortBy = "vote_count",
  page = "1"
) => {
  const response = await api.get(
    `/${target}/discover?genres=${genres}&sort_by=${sortBy}&page=${page}`
  );
  return response.data;
};

export const fetchCategory = async (api, target, category, page = "1") => {
  const response = await api.get(
    `/${target}/list?category=${category}&page=${page}`
  );
  return response.data.results;
};

export const fetchVideos = async (api, target, id) => {
  const response = await api.get(`/${target}/${id}/videos`);
  return response.data.results;
};

export const fetchCredits = async (api, target, id) => {
  const response = await api.get(`/${target}/${id}/credits`);
  return response.data;
};

export const fetchSearchQueryResults = async (api, target, query, page) => {
  const response = await api.get(
    `/${target}/search?query=${query}&page=${page}`
  );
  return response.data;
};

export const fetchTvShowVideos = async (api, id) => {
  const response = await api.get(`/tvshows/${id}/videos`);
  return response.data.results;
};

export const fetchTvShowEpisodeVideos = async (
  api,
  id,
  seasonNumber,
  episodeNumber
) => {
  const response = await api
    .get(`/tvshows/${id}/${seasonNumber}/${episodeNumber}/videos`)
    .then((res) => res.data.results);
  return response;
};

export const fetchTvShowEpisodeDetails = async (
  api,
  id,
  seasonNumber,
  episodeNumber
) => {
  const response = await api.get(
    `/tvshows/${id}/${seasonNumber}/${episodeNumber}`
  );
  return response.data;
};

export const fetchTvShowSeason = async (api, id, seasonNumber) => {
  const response = await api.get(`/tvshows/${id}/${seasonNumber}`);
  return response.data;
};

export const fetchTvShowSeasonVideos = async (api, id, seasonNumber) => {
  const response = await api.get(`/tvshows/${id}/${seasonNumber}/videos`);
  return response.data.results;
};

export const fetchReviews = async (api, id, title, currentPage = 1) => {
  const response = await api.get(
    `/reviews?id=${id}&title=${title}&page=${currentPage}`
  );
  return response.data;
};

export const fetchUserList = async (api, id) => {
  try {
    const response = await api.get(`/lists?user_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch list.", error);
  }
};

export const fetchUserReviews = async (api, id, page = 1) => {
  const response = await api.get(`/reviews/${id}?page=${page}`);
  return response.data;
};

export const createList = async (api, listName, listType, list) => {
  const res = await api.post("/lists", {
    list: {
      name: listName,
      type: listType,
      list: list,
    },
  });

  return res;
};

export const addListItem = async (api, listId, list) => {
  const res = await api.post("/lists/item", {
    list_id: listId,
    list_item: list,
  });

  return res;
};

export const patchList = async (api, listId, list) => {
  const res = await api.patch(`/lists?list_id=${listId}`, {
    new_list: list,
  });

  return res;
};
