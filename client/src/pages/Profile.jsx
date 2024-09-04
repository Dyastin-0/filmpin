import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faImage } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import SelectBackdrop from '../components/SelectBackdrop';
import UserBackdrop from '../components/UserBackdrop';
import { Dropdown, DropdownItem } from '../components/ui/Dropdown';
import { useEffect } from 'react';
import SelectProfile from '../components/SelectProfile';

const Profile = () => {
	const { user } = useAuth();
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

	useEffect(() => {
		document.title = user?.username;
	}, []);

	return (
		<div className='relative flex flex-col items-center w-full h-full bg-primary rounded-md'>
			<div className='relative flex justify-center p-4 items-center w-full max-h-[400px] rounded-md'>
				{user?.backdropPath ?
					<UserBackdrop username={user.username} backdropPath={user.backdropPath} /> :
					<div className='absolute top-12 flex items-center gap-2 p-2 drop-shadow-sm bg-accent rounded-md hover:cursor-pointer'
						onClick={handleSelectBackdrop}
					>
						<FontAwesomeIcon className='text-primary-foreground text-xl' icon={faImage} />
						<p className='text-xs text-primary-foreground font-semibold'>Select a backdrop for your profile</p>
					</div>
				}
			</div>
			<motion.div
				initial={{ y: -120 }}
				className='flex gap-4 w-[calc(100%-4rem)] h-[200px] p-4 bg-accent rounded-md'
			>
				<div className='flex flex-col gap-4 justify-center'>
					{user.profileImageURL ?
						<img
							alt={`${user.username} profile image`}
							src={user.profileImageURL}
							className='w-[70px] h-[70px] rounded-full'
						/>
						: <div
							className='flex justify-center items-center w-[70px] h-[70px] rounded-full bg-secondary
						hover:cursor-pointer'
							onClick={handleSelectProfile}
						>
							<FontAwesomeIcon icon={faImage} />
						</div>
					}
					<div>
						<h1 className='text-primary-foreground text-xs font-semibold'>{user?.username}</h1>
						<h1 className='text-primary-foreground text-xs'>{user?.email}</h1>
					</div>
				</div>
				<div className='absolute top-4 right-4'>
					<Dropdown name={<FontAwesomeIcon icon={faEllipsisH} />}>
						<DropdownItem onClick={handleSelectProfile}>
							Change profile
						</DropdownItem>
						<DropdownItem onClick={handleSelectBackdrop}>
							Change background
						</DropdownItem>
					</Dropdown>
				</div>
			</motion.div>
		</div>
	)
}

export default Profile;
