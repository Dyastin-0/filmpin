import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faImage } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import SelectBackdrop from '../components/SelectBackdrop';
import UserBackdrop from '../components/UserBackdrop';
import { Dropdown, DropdownItem } from '../components/ui/Dropdown';
import { useEffect, useState } from 'react';
import SelectProfile from '../components/SelectProfile';
import { Image } from '../components/ui/Image';
import useAxios from '../hooks/useAxios';
import { useLocation, useNavigate } from 'react-router-dom';
import ListSection from '../components/sections/ListSection';

const Profile = () => {
	const api = useAxios();
	const location = useLocation();
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const { user, token } = useAuth();
	const { setModal, setOpen } = useModal();

	const handleSelectBackdrop = () => {
		setModal(
			<SelectBackdrop />
		);
		setOpen(true);
	}

	const handleSelectProfile = () => {
		setModal(
			<SelectProfile />
		);
		setOpen(true);
	}

	const handleViewProfile = () => {
		setModal(
			<Image imageURL={userData.profileImageURL} name={userData.username} />
		);
		setOpen(true);
	}

	useEffect(() => {
		if (userData) document.title = userData.username;
	}, [userData]);

	useEffect(() => {
		if (location.pathname.slice(1) !== user?.username) {
			const getUser = async () => {
				try {
					const response = await api.get(`/public/account?username=${location.pathname.slice(1)}`);
					const publicUserData = response.data.user;
					setUserData(publicUserData);
				} catch (error) {
					console.error('Failed to get user.', error);
					navigate('/404');
				}
			}
			getUser();
		} else {
			setUserData(user);
		}
	}, [location, user]);
	return (
		<div className='relative flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md'>
			<div className='relative flex justify-center items-center w-full max-h-[400px] rounded-md'>
				{userData?.backdropPath ?
					<UserBackdrop username={userData.username} backdropPath={userData.backdropPath} /> :
					token && userData?._id === user?._id ?
						<div
							className='relative flex justify-center gap-2 p-4 items-center w-full min-h-[400px] rounded-md
						hover:cursor-pointer'
							onClick={handleSelectBackdrop}
						>
							<FontAwesomeIcon className='text-primary-foreground text-xl' icon={faImage} />
							<p className='text-xs text-primary-foreground font-semibold'>Select a backdrop for your profile</p>
						</div> :
						<div className='relative flex justify-center gap-2 p-4 items-center w-full min-h-[400px] rounded-md'></div>
				}
			</div>
			<motion.div
				initial={{ y: -120 }}
				className='flex gap-4 w-[calc(100%-2rem)] h-[200px] p-4 bg-accent rounded-md'
			>
				<div className='flex flex-col max-w-full items-center gap-4'>
					{userData?.profileImageURL ?
						<div className='flex flex-col justify-center items-center gap-2'>
							<img
								alt={`${userData.username} profile image`}
								src={userData.profileImageURL}
								onClick={handleViewProfile}
								className='w-[100px] h-[100px] rounded-full
							transition-all duration-300 hover:cursor-pointer hover:opacity-70'
							/>
						</div>
						: <div
							className='flex justify-center items-center w-[100px] h-[100px] rounded-full bg-secondary
						hover:cursor-pointer'
							onClick={handleSelectProfile}
						>
							<FontAwesomeIcon icon={faImage} />
						</div>
					}
					<div>
						<h1 className='text-primary-foreground text-sm font-semibold'>{userData?.username}</h1>
						<h1 className='text-center text-primary-foreground mt-2 text-xs line-clamp-1 font-semibold'>{userData?.email}</h1>
					</div>
				</div>
				<div className='absolute top-4 right-4'>
					{token && userData?._id === user?._id &&
						<Dropdown name={<FontAwesomeIcon icon={faEllipsisH} />}>
							<DropdownItem onClick={handleSelectProfile}>
								Change profile
							</DropdownItem>
							<DropdownItem onClick={handleSelectBackdrop}>
								Change background
							</DropdownItem>
						</Dropdown>
					}
				</div>
			</motion.div>
			{token ?
				<ListSection userData={userData} />
				:
				<motion.section
					initial={{ marginTop: -120 }}
					className='flex justify-center items-center gap-4 w-[calc(100%-2rem)] p-4 bg-accent rounded-md'
				>
					<h1 className='text-xs text-primary-foreground font-semibold'>{`Sign in to view ${userData?.username}'s lists.`}</h1>
				</motion.section>
			}
		</div>
	)
}

export default Profile;
