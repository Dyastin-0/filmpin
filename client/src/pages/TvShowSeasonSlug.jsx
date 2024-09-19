import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import Frame from '../components/Frame';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { MovieSlugLoader } from '../components/loaders/MovieSlugLoader';
import useAxios from '../hooks/useAxios';
import EpisodeSection from '../components/sections/EpisodeSection';
import { fetchTvShowSeason, fetchTvShowSeasonVideos } from '../helpers/api';
import { useEffect, useState } from 'react';
import { ClipSection } from '../components/sections/ClipSection';
import useSWR from 'swr';
import { Helmet } from 'react-helmet';

const TvShowSeasonSlug = () => {
	const [searchParams] = useSearchParams();
	const { api, isAxiosReady } = useAxios();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

	const id = searchParams.get('id')?.split('_')[0];
	const seasonNumber = searchParams.get('season_number');
	const title = searchParams.get('title');
	const backdropPath = searchParams.get('backdrop_path');

	const { data: details, isLoading
	} = useSWR(
		isAxiosReady ? `/tvshows/season?tvshow_id=${id}&season_number=${seasonNumber}` : null,
		() => fetchTvShowSeason(api, id, seasonNumber)
	);

	const { data: videos
	} = useSWR(
		isAxiosReady ? `/tvshows/season/videos?tvshow_id=${id}&tvshow_season=${seasonNumber}` : null,
		() => fetchTvShowSeasonVideos(api, id, seasonNumber), {
		onSuccess: (data) => setTrailerYoutubeKey(data[0].key)
	}
	);

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, [details]);

	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			<Helmet>
				<title>{details?.name}</title>
			</Helmet>
			{isLoading ? (
				<MovieSlugLoader />
			) : (
				details && (
					<>
						<div className="relative w-full h-[400px] rounded-md overflow-hidden">
							<div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
							<img
								loading='lazy'
								className='w-full h-full object-cover'
								src={`https://image.tmdb.org/t/p/original/${backdropPath}`}
								alt={`${details.name} backdrop`}
							/>
						</div>
						<motion.div
							initial={{ y: -120 }}
							className='flex md:flex-row flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4'
						>
							<div className='flex flex-col w-fit self-center gap-3'>
								<img
									loading='lazy'
									className='rounded-lg min-w-[168px] h-[250px] self-center'
									src={`https://image.tmdb.org/t/p/w200/${details.poster_path}`}
									alt={`${details.name} poster`}
								/>
								<Button
									text={<p className='text-md font-semibold'> Watch Trailer <FontAwesomeIcon size='lg' icon={faPlay} /></p>}
									onClick={() => {
										setModal(
											<Frame youtubeKey={trailerYoutubeKey} title={title} />
										);
										setOpen(true);
									}}
								/>
							</div>
							<div className='flex flex-col gap-2 w-full'>
								<p className='text-primary-foreground text-xs'>{details.tagline}</p>
								<h1 className='text-primary-foreground text-4xl font-semibold'> {title} </h1>
								<h1 className='text-primary-foreground text-md font-semibold'> {details.name} </h1>
								<p className='text-primary-foreground text-sm'> {details.overview} </p>
								<h4 className='text-primary-foreground text-xs'> {`${details.air_date?.split('-')[0]}`} </h4>
								<p className='text-primary-foreground text-xs'> {`${details.episodes.length} episodes`} </p>
							</div>
						</motion.div>
					</>
				)
			)}
			<motion.div
				initial={{ marginTop: -120 }}
				className='flex md:flex-row flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4'
			>
				{details?.episodes ? (
					<EpisodeSection
						episodes={details.episodes}
						seasonNumber={seasonNumber}
						showId={id}
						backdropPath={backdropPath}
						title={title}
					/>
				) : (
					<LoadingMovieSection title='Episodes' />
				)}
			</motion.div>
			{videos?.length > 0 &&
				<div className='flex flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4'>
					<ClipSection keys={videos.map((video) => ({
						name: video.name,
						value: video.key
					}))}
						title='Videos'
					/>
				</div>
			}
		</div>
	);
};

export default TvShowSeasonSlug;
