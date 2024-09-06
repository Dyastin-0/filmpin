import { motion } from 'framer-motion';
import useAxios from '../../hooks/useAxios';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import Button from '../ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../hooks/useModal';
import CreateList from '../CreateList';

const ListSection = () => {
	const { token } = useAuth();
	const api = useAxios();
	const { setModal, setOpen } = useModal();

	const handleGetList = async () => {
		try {
			const response = await api.get('/list');
			console.log(response.data);
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
			className='relative flex gap-4 w-[calc(100%-4rem)] h-[200px] p-4 bg-accent rounded-md'
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
		</motion.section>
	)
}

export default ListSection