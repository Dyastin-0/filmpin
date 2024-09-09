import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAxios from '../../hooks/useAxios';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../hooks/useModal';
import CreateList from '../CreateList';
import MovieList from '../MovieList';
import { io } from 'socket.io-client';

const ListSection = ({ userData }) => {
	const { token, user } = useAuth();
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
	};

	const handleCreateList = () => {
		setModal(<CreateList />);
		setOpen(true);
	};

	useEffect(() => {
		if (token && user && userData) {
			const randomId = crypto.randomUUID();
			const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
				query: {
					owner: userData._id,
					accesor: user._id,
					randomId: randomId,
					accessToken: token
				}
			});
			console.log(`listChange/${userData._id}/${user._id}/${randomId}`);
			newSocket.on(`listChange/${userData._id}/${user._id}/${randomId}`, (change) => {
				console.log(change)
				if (change.type === 'delete') {
					console.log(change)
					setList((prevList) => prevList.filter((list) => list._id !== change.list));
				} else {
					setList((prevList) => {
						const exists = prevList.some(item => item._id === change.list._id);
						return exists ? prevList : [...prevList, change.list];
					});
				}
			});
			return () => newSocket.disconnect();
		}
	}, [token, userData, user]);

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
					list.map((item) => (
						<MovieList key={item._id} list={item} />
					))
				}
			</div>
		</motion.section>
	);
};

export default ListSection;
