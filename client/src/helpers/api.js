export const fetchOwner = async (axios, id) => {
  const response = await axios.get(`/public/account?id=${id}`);
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

export const fetchVideos = async (api, target, queryParam, id) => {
  const response = await api.get(`/${target}/videos?${queryParam}=${id}`);
  return response.data.results;
};

export const fetchCredits = async (api, target, id) => {
  const response = await api.get(`/${target}/credits?movie_id=${id}`);
  return response.data;
};

export const fetchSearchQueryResults = async (api, target, query, page) => {
  const response = await api.get(
    `/${target}/search?query=${query}&page=${page}`
  );
  return response.data;
};

export const fetchTvShowVideos = async (api, id) => {
  const response = await api.get(`/tvshows/videos?show_id=${id}`);
  return response.data.results;
};

export const fetchTvShowEpisodeVideos = async (
  api,
  id,
  seasonNumber,
  episodeNumber
) => {
  const response = await api
    .get(
      `/tvshows/season/episode/videos?tvshow_id=${id}&tvshow_season=${seasonNumber}&episode_number=${episodeNumber}`
    )
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
    `/tvshows/season/episode?tvshow_id=${id}&season_number=${seasonNumber}&episode_number=${episodeNumber}`
  );
  return response.data;
};

export const fetchTvShowSeason = async (api, id, seasonNumber) => {
  const response = await api.get(
    `/tvshows/season?tvshow_id=${id}&season_number=${seasonNumber}`
  );
  return response.data;
};

export const fetchTvShowSeasonVideos = async (api, id, seasonNumber) => {
  const response = await api.get(
    `/tvshows/season/videos?tvshow_id=${id}&tvshow_season=${seasonNumber}`
  );
  return response.data.results;
};

export const fetchReviews = async (api, id, currentPage = 1) => {
  const response = await api.get(
    `/movies/reviews?id=${id}&page=${currentPage}`
  );
  return response.data;
};
