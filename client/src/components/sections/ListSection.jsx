import { useState } from 'react';
import { motion } from 'framer-motion';
import useAxios from '../../hooks/useAxios';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import Button from '../ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../hooks/useModal';
import CreateList from '../CreateList';
import MovieList from '../MovieList';
const ListSection = () => {
	const { token } = useAuth();
	const api = useAxios();
	const { setModal, setOpen } = useModal();
	const [list, setList] = useState([]);

	const handleGetList = async () => {
		try {
			const response = await api.get('/list');
			setList(response.data);
		} catch (error) {
			console.error('Failed to fetch list.', error);
		}
	}

	const handleCreateList = () => {
		setModal(
			<CreateList />
		);
		setOpen(true);
	}

	useEffect(() => {
		if (token) handleGetList();
	}, [token]);

	return (
		<motion.section
			initial={{ marginTop: -120 }}
			className='relative flex flex-col gap-4 w-[calc(100%-4rem)] p-4 bg-accent rounded-md'
		>
			<h1 className='text-primary-foreground pb-4 text-sm font-semibold'>Lists</h1>
			{token &&
				<Button
					className='absolute top-4 right-4'
					onClick={handleCreateList}
					icon={<FontAwesomeIcon icon={faPlus} />}
					text='Create a list'
				/>
			}
			<div className='flex flex-wrap justify-center w-full gap-4'>
				{list.length > 0 &&
					list.map((item, index) => {
						return (
							<MovieList key={index} list={item} />
						);
					})
				}
			</div>
		</motion.section>
	)
}

export default ListSection;