import { useEffect, useRef, useState } from 'react';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import Selector from './ui/Selector';
import Button from './ui/Button';
import { movieGenres, tvShowGenres } from '../models/genres';
import useAxios from '../hooks/useAxios';
import { useToast } from '../components/hooks/useToast';
import { useModal } from './hooks/useModal';

const CreateList = () => {
	const { setOpen } = useModal();
	const api = useAxios();
	const titleRef = useRef(null);
	const [type, setType] = useState('movies');
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [name, setName] = useState('');
	const [fetched, setFetched] = useState(null);
	const { toastError, toastSuccess } = useToast();

	const fetch = async (type, genres) => {
		try {
			const response = await api.get(`/${type}/discover?genres=${genres}&sort_by=vote_count&page=1`);
			return response.data;
		} catch (error) {
			console.error('Failed to fetch movies/tvshows.', error);
		}
	}

	const handleCreateList = async (e) => {
		e.preventDefault();
		const randomIndex = Math.floor(Math.random() * fetched.length);  
		try {
			const response = await api.post('/list', {
				list: {
					type: type,
					list: [{
						id: fetched[randomIndex].id,
						backdrop_path: fetched[randomIndex].backdrop_path,
						poster_path: fetched[randomIndex].poster_path
					}],
					name: name
				}
			});
			toastSuccess('List successfully created.');
			setOpen(false);
		} catch (error) {
			console.error('Failed to create list.', error);
			toastError('Failed to create list.');
		}
	}

	useEffect(() => {
		titleRef.current.focus();
	}, []);

	useEffect(() => {
		if (type) setSelectedGenres([]);
	}, [type]);

	useEffect(() => {
		if (selectedGenres.length > 0) {
			fetch(type.replace(' ', '').toLowerCase(), selectedGenres.join('_').toLowerCase()).then(response => {
				setFetched(response.results);
			});
		}
	}, [selectedGenres]);

	return (
		<form className='flex flex-col w-[400px] max-w-full p-4 gap-4 bg-primary rounded-md overflow-hidden'
			onSubmit={handleCreateList}
		>
			<h1 className='text-center text-xs font-semibold'>Create a List</h1>
			<input
				ref={titleRef}
				onChange={(e) => setName(e.currentTarget.value)}
				value={name}
				className='outline-none rounded-md bg-secondary p-2
				text-xs placeholder:text-secondary-foreground
				transition-all duration-300
				focus:shadow-[0_0_0_2px] focus:shadow-secondary-accent'
				placeholder='Name your list'
			/>
			<div className='flex justify-between'>
				<input
					disabled={true}
					className='outline-none rounded-md bg-secondary p-2
					text-xs placeholder:text-secondary-foreground
					transition-all duration-300
					focus:shadow-[0_0_0_2px] focus:shadow-secondary-accent'
					placeholder='Type'
					value={type}
				/>
				<Dropdown name='Select type'>
					<DropdownItem onClick={() => setType('TV Shows')}>TV shows</DropdownItem>
					<DropdownItem onClick={() => setType('Movies')}>Movies</DropdownItem>
				</Dropdown>
			</div>
			<h1 className='text-xs text-primary-foreground'>Select genres you like to start with</h1>
			<Selector items={type === 'movies' ? movieGenres : tvShowGenres} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
			<Button text='Create' type='submit' />
		</form>
	)
}

export default CreateList