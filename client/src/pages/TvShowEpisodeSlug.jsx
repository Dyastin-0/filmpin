import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import Frame from '../components/Frame';
import { useLoading } from '../components/hooks/useLoading';
import { MovieSlugLoader } from '../components/loaders/MovieSlugLoader';
import useAxios from '../hooks/useAxios';
import CrewSection from '../components/sections/CrewSection';
import Crew from '../components/Crew';
import Cast from '../components/Cast';
import CastSection from '../components/sections/CastSection';
import { ClipSection } from '../components/sections/ClipSection';

const TvShowEpisodeSlug = () => {
	const [searchParams] = useSearchParams();
	const api = useAxios();
	const { setLoading } = useLoading();
	const [details, setDetails] = useState(null);
	const [crews, setCrews] = useState(null);
	const [casts, setCasts] = useState(null);
	const writers = crews?.filter(crew => crew.job === 'Writer');
	const location = useLocation();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);
	const [videos, setVideos] = useState(null);
	const id = searchParams.get('id').split('_')[0];
	const seasonNumber = searchParams.get('season_number');
	const episodeNumber = searchParams.get('episode_number');
	const title = searchParams.get('title');
	const backdrop_path = searchParams.get('backdrop_path');

	const getVideos = async (id, seasonNumber, episodeNumber) => {
		try {
			const videos = await api.get(`/tvshows/season/episode/videos?tvshow_id=${id}&tvshow_season=${seasonNumber}&episode_number=${episodeNumber}`);
			return videos.data;
		} catch (error) {
			console.error(`Failed to get videos for show with id '${id}'`, error);
		}
	}

	const getDetails = async (showId, seasonNumber, episodeNumber) => {
		try {
			const response = await api.get(`/tvshows/season/episode?tvshow_id=${showId}&season_number=${seasonNumber}&episode_number=${episodeNumber}`);
			return response.data;
		} catch (error) {
			console.error('Failed to get seasons', error);
		}
	}

	useEffect(() => {
		if (id) {
			const stateDetails = location.state?.details;
			if (!stateDetails) {
				setLoading(true);
				getDetails(id, seasonNumber, episodeNumber).then(details => {
					setDetails(details);
					setCrews(details.crew);
					setCasts(details.guest_stars.sort((a, b) => b.popularity - a.popularity));
					setLoading(false);
				});
			} else {
				setDetails(stateDetails);
				setCrews(stateDetails.crew);
				setCasts(stateDetails.guest_stars.sort((a, b) => b.popularity - a.popularity));
				setLoading(false);
			}
			getVideos(id, seasonNumber, episodeNumber).then(videos => setVideos(videos.results));
		}
	}, [id]);

	useEffect(() => {
		videos && setTrailerYoutubeKey(videos.find(video => video)?.key);
	}, [videos]);

	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			{details ?
				<>
					<div className='w-full h-[400px] rounded-lg overflow-hidden'>
						<img
							loading='lazy'
							className='w-full h-full object-cover'
							src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
							alt={`${details?.name} backdrop`}
						/>
					</div>
					<motion.div
						initial={{ y: -120 }}
						className='flex md:flex-row flex-col bg-accent p-4 rounded-md max-w-full w-[90%] gap-4 shadow-sm'
					>
						<div className='flex w-fit self-center flex-col gap-3'>
							<img
								loading='lazy'
								className='rounded-lg max-w-[168px] h-[250px] object-cover self-center'
								src={`https://image.tmdb.org/t/p/w400/${details?.still_path}`}
								alt={`${details?.name} poster`}
							/>
							<Button
								text={<p className='text-md font-semibold'>Watch trailer <FontAwesomeIcon size='lg' icon={faPlay} /></p>}
								onClick={() => {
									setModal(
										<Frame youtubeKey={trailerYoutubeKey} title={title} />
									);
									setOpen(true);
								}}
							/>
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<h1 className='text-primary-foreground text-4xl font-semibold'> {`${title}, S${seasonNumber}`} </h1>
							<h1 className='text-primary-foreground text-md font-semibold'> {details?.name} </h1>
							<p className='text-primary-foreground text-md'> {details?.overview} </p>
							<h4 className='text-primary-foreground text-xs'> {`${details?.air_date?.split('-')[0]}`} </h4>
							<p className='text-primary-foreground text-xs'> {`${Math.floor(details?.runtime / 60)}h ${details?.runtime % 60}m`} </p>
						</div>
					</motion.div>
				</> :
				<MovieSlugLoader />
			}
			<motion.div
				initial={{ marginTop: -120 }}
				className='flex flex-col bg-accent p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4 shadow-sm'
			>
				<h1 className='text-primary-foreground text-md font-semibold'>Credits</h1>
				<h1 className='text-primary-foreground text-sm font-semibold'>Director</h1>
				{crews &&
					crews.map((crew, index) => crew.job === 'Director' && <Crew info={crew} key={index} />)
				}
				{writers && writers.length > 0 && (
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
				{casts &&
					<div className='flex flex-wrap gap-4'>
						<Cast info={casts[0]} />
					</div>
				}
				<CastSection title='Full cast' casts={casts} />
				<CrewSection title='Full crew' crews={details?.crew} />
			</motion.div>
			{videos?.length > 0 &&
				<div className='flex flex-col bg-accent p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4 shadow-sm'>
					<ClipSection keys={videos?.map((video) => {
						return { name: video.name, value: video.key }
					})}
						title='Videos'
					/>
				</div>
			}
		</div>
	)
}

export default TvShowEpisodeSlug;