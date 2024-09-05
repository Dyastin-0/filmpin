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
import { useLocation } from 'react-router-dom';

const Profile = () => {
	const api = useAxios();
	const location = useLocation();
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
			api.get(`/public/account?username=${location.pathname.slice(1)}`).then(response => {
				const publicUserData = response.data.user;
				publicUserData ? setUserData(publicUserData) : setUserData(user)
			})
		} else {
			setUserData(user);
		}
	}, [user, location.pathname]);

	return (
		<div className='relative flex flex-col items-center w-full h-full bg-primary rounded-md'>
			<div className='relative flex justify-center p-4 items-center w-full max-h-[400px] rounded-md'>
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
				className='flex gap-4 w-[calc(100%-4rem)] h-[200px] p-4 bg-accent rounded-md'
			>
				<div className='flex flex-col items-center gap-4'>
					{userData?.profileImageURL ?
						<div className='flex flex-col justify-center items-center gap-2'>
							<img
								alt={`${userData.username} profile image`}
								src={userData.profileImageURL}
								onClick={handleViewProfile}
								className='w-[100px] h-[100px] rounded-full
							transition-all duration-300 hover:cursor-pointer hover:opacity-70'
							/>
							<div>
								<h1 className='text-primary-foreground text-sm font-semibold'>{userData?.username}</h1>
								<h1 className='text-primary-foreground text-xs'>{userData?.email}</h1>
							</div>
						</div>
						: <div
							className='flex justify-center items-center w-[70px] h-[70px] rounded-full bg-secondary
							hover:cursor-pointer'
							onClick={handleSelectProfile}
						>
							<FontAwesomeIcon icon={faImage} />
						</div>
					}
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
		</div>
	)
}

export default Profile;
