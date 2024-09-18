import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import Frame from '../components/Frame';
import { MovieSlugLoader } from '../components/loaders/MovieSlugLoader';
import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import CrewSection from '../components/sections/CrewSection';
import Crew from '../components/Crew';
import Cast from '../components/Cast';
import CastSection from '../components/sections/CastSection';
import { ClipSection } from '../components/sections/ClipSection';
import { fetchTvShowEpisodeDetails, fetchTvShowEpisodeVideos } from '../helpers/api';

const TvShowEpisodeSlug = () => {
	const [searchParams] = useSearchParams();
	const api = useAxios();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

	const id = searchParams.get('id')?.split('_')[0] || '';
	const seasonNumber = searchParams.get('season_number') || '';
	const episodeNumber = searchParams.get('episode_number') || '';
	const title = searchParams.get('title') || '';
	const backdrop_path = searchParams.get('backdrop_path') || '';

	const [details, setDetails] = useState(null);
	const [videos, setVideos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		setIsError(false);

		const fetchData = async () => {
			try {
				const detailsData = await fetchTvShowEpisodeDetails(api, id, seasonNumber, episodeNumber);
				const videosData = await fetchTvShowEpisodeVideos(api, id, seasonNumber, episodeNumber);

				setDetails(detailsData);
				setVideos(videosData);
				setTrailerYoutubeKey(videosData.length > 0 ? videosData[0].key : null);
			} catch (error) {
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [api, id, seasonNumber, episodeNumber]);

	useEffect(() => {
		document.title = details?.name || 'TV Show Episode';
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, [details]);

	const writers = details?.crew.filter(crew => crew.job === 'Writer') || [];
	const casts = details?.guest_stars?.sort((a, b) => b.popularity - a.popularity) || [];

	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			{isLoading ? (
				<MovieSlugLoader />
			) : isError ? (
				<div>Error loading data.</div>
			) : details ? (
				<>
					<div className="relative w-full h-[400px] rounded-md overflow-hidden">
						<div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
						<img
							loading='lazy'
							className='w-full h-full object-cover'
							src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
							alt={`${details?.name} backdrop`}
						/>
					</div>
					<motion.div
						initial={{ y: -120 }}
						className='flex md:flex-row flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4'
					>
						<div className='flex w-fit self-center flex-col gap-3'>
							<img
								loading='lazy'
								className='rounded-lg max-w-[168px] h-[250px] object-cover self-center'
								src={`https://image.tmdb.org/t/p/w400/${details?.still_path}`}
								alt={`${details?.name} poster`}
							/>
							<Button
								text={<p className='text-md font-semibold'> Watch Clip <FontAwesomeIcon size='lg' icon={faPlay} /></p>}
								onClick={() => {
									setModal(<Frame youtubeKey={trailerYoutubeKey} title={title} />);
									setOpen(true);
								}}
							/>
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<h1 className='text-primary-foreground text-4xl font-semibold'> {`${title}, S${seasonNumber}`} </h1>
							<h1 className='text-primary-foreground text-md font-semibold'> {details?.name} </h1>
							<p className='text-primary-foreground text-sm'> {details?.overview} </p>
							<h4 className='text-primary-foreground text-xs'> {`${details?.air_date?.split('-')[0]}`} </h4>
							<p className='text-primary-foreground text-xs'> {`${Math.floor(details?.runtime / 60)}h ${details?.runtime % 60}m`} </p>
						</div>
					</motion.div>
					<motion.div
						initial={{ marginTop: -120 }}
						className='flex flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4'
					>
						<h1 className='text-primary-foreground text-md font-semibold'>Credits</h1>
						<h1 className='text-primary-foreground text-sm font-semibold'>Director</h1>
						{details?.crew &&
							details.crew.map((crew, index) => crew.job === 'Director' && <Crew info={crew} key={index} />)
						}
						{writers.length > 0 && (
							<>
								<h1 className='text-primary-foreground text-xs font-semibold'> Writer </h1>
								<div className='flex flex-wrap gap-4'>
									{writers.map((writer, index) => (
										<Crew info={writer} key={index} />
									))}
								</div>
							</>
						)}
						<h1 className='text-primary-foreground text-xs font-semibold'> Popular cast </h1>
						{casts.length > 0 &&
							<div className='flex flex-wrap gap-4'>
								<Cast info={casts[0]} />
							</div>
						}
						<CastSection title='Full cast' casts={casts} />
						<CrewSection title='Full crew' crews={details?.crew} />
					</motion.div>
					{videos.length > 0 &&
						<div className='flex flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4'>
							<ClipSection keys={videos.map((video) => ({
								name: video.name,
								value: video.key
							}))} title='Videos' />
						</div>
					}
				</>
			) : (
				<MovieSlugLoader />
			)}
		</div>
	);
};

export default TvShowEpisodeSlug;
