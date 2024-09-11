import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useAxios from '../hooks/useAxios';
import Checkbox from './ui/Checkbox';
import Button from './ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import listTypes from '../models/listTypes';
import { useToast } from '../components/hooks/useToast';
import { useModal } from './hooks/useModal';

const AddListMovie = ({ movie }) => {
	const { user } = useAuth();
	const api = useAxios();
	const { toastError, toastSuccess } = useToast();
	const { setOpen } = useModal();
	const [lists, setLists] = useState([]);
	const [selectedList, setSelectedList] = useState([]);

	const getList = async (id) => {
		try {
			const response = await api.get(`/list/${id}`);
			return response.data;
		} catch (error) {
			console.error('Failed to fetch list', error);
		}
	}

	const handleAddMovie = async () => {
		if (!user.lists) return toastError(`You don't have any list, go to your profile to create one.`);
		if (!selectedList.length > 0) return toastError('No list selected.');
		selectedList.map((list, _) => (
			api.post('/list/item', {
				list_id: list,
				list_item: {
					id: movie.id,
					title: movie.title,
					poster_path: movie.poster_path,
					backdrop_path: movie.backdrop_path
				}
			})
				.then((response) => {
					toastSuccess(`${movie.title} added to ${response.data.list_name}.`);
					setOpen(false);
				})
				.catch((error) => {
					console.error('Failed to add movie to list.', error);
					toastError(error.response.data.message || `Failed to add ${movie.title}`);
				})
		));
	}

	useEffect(() => {
		if (user?.lists) {
			const getLists = async () => {
				const lists = await Promise.all(user.lists.map((item, _) => getList(item)));
				setLists(lists);
			}
			getLists();
		}
	}, [user]);

	return (
		<div className='flex flex-col w-[400px] max-w-full p-4 gap-4 bg-primary rounded-md overflow-hidden'>
			<h1 className='text-center text-xs font-semibold'>{`Add ${movie?.title} to your list`}</h1>
			<h1 className='text-xs text-primary-foreground'>Your movie lists</h1>
			{lists?.length > 0 && lists.map((list, index) => listTypes[list?.type] === 'Movies' &&
				<Checkbox
					key={index}
					name={list.name}
					value={selectedList.includes(list._id)}
					onChecked={() =>
						setSelectedList((prev) => prev.includes(list._id) ? prev.filter((item) => item !== list._id) : [...prev, list._id])
					}
				/>
			)}
			<Button text={`Add ${movie.title}`} icon={<FontAwesomeIcon icon={faPlus} />} onClick={handleAddMovie} />
		</div>
	)
}

export default AddListMovie;