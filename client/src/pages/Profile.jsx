import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faImage } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth';
import { useModal } from '../components/hooks/useModal';
import useAxios from '../hooks/useAxios';
import UserBackdrop from '../components/UserBackdrop';
import SelectBackdrop from '../components/SelectBackdrop';
import SelectProfile from '../components/SelectProfile';
import { Image } from '../components/ui/Image';
import ListSection from '../components/sections/ListSection';
import { Dropdown, DropdownItem } from '../components/ui/Dropdown';
import { fetchUserData } from '../helpers/api';
import useSWR from 'swr';
import { Helmet } from 'react-helmet';

const Profile = () => {
  const { api, isAxiosReady } = useAxios();
  const { user, setUser, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { setModal, setOpen } = useModal();
  const username = location.pathname.slice(1);

  const { data: userData, isLoading, isError, mutate
  } = useSWR(
    isAxiosReady ? `/public/account?username=${username}` : null,
    () => fetchUserData(api, username), {
    onError: () => navigate('/404')
  }
  );

  useEffect(() => {
    if (user) mutate();
  }, [user, setUser])

  return (
    <div className='relative flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md'>
      <Helmet>
        <title>{userData?.username}</title>
      </Helmet>
      <div className='relative flex justify-center items-center w-full max-h-[400px] rounded-md'>
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
        {userData?.backdropPath ? (
          <UserBackdrop username={userData.username} backdropPath={userData.backdropPath} />
        ) : token && userData?._id === user?._id ? (
          <div
            className='relative flex justify-center gap-2 p-4 items-center w-full min-h-[400px] rounded-md hover:cursor-pointer'
            onClick={() => {
              setModal(<SelectBackdrop />);
              setOpen(true);
            }}
          >
            <FontAwesomeIcon className='text-primary-foreground text-xl' icon={faImage} />
            <p className='text-xs text-primary-foreground font-semibold'>Select a backdrop for your profile</p>
          </div>
        ) : (
          <div className='relative flex justify-center gap-2 p-4 items-center w-full min-h-[400px] rounded-md'></div>
        )}
      </div>
      <motion.div
        initial={{ y: -120 }}
        className='flex gap-4 w-[calc(100%-2rem)] h-[300px] p-4 rounded-md'
      >
        <div className='flex flex-col max-w-full items-center gap-4'>
          {!isLoading && userData?.profileImageURL ? (
            <div className='flex flex-col justify-center items-center gap-2'>
              <img
                alt={`${userData.username} profile image`}
                src={userData.profileImageURL}
                onClick={() => {
                  setModal(<Image imageURL={userData?.profileImageURL} name={userData?.username} />);
                  setOpen(true);
                }}
                className='w-[100px] h-[100px] object-cover rounded-full transition-all duration-300 hover:cursor-pointer hover:opacity-70'
              />
            </div>
          ) : (
            <div
              className='flex justify-center items-center w-[100px] h-[100px] rounded-full bg-secondary hover:cursor-pointer'
              onClick={() => {
                setModal(<SelectProfile />);
                setOpen(true);
              }}
            >
              <FontAwesomeIcon icon={faImage} />
            </div>
          )}
          <div>
            <h1 className='text-primary-foreground text-sm font-semibold'>{userData?.username}</h1>
            <h1 className='text-center text-primary-foreground mt-2 text-xs line-clamp-1 font-semibold'>{userData?.email}</h1>
          </div>
        </div>
        {token && userData?._id === user?._id && (
          <div className='absolute top-4 right-4'>
            <Dropdown name={<FontAwesomeIcon icon={faEllipsisH} />}>
              <DropdownItem onClick={() => {
                setModal(<SelectProfile />);
                setOpen(true);
              }}>Change profile</DropdownItem>
              <DropdownItem onClick={() => {
                setModal(<SelectBackdrop />);
                setOpen(true);
              }}>Change background</DropdownItem>
            </Dropdown>
          </div>
        )}
      </motion.div>
      {token ? (
        <ListSection userData={userData} />
      ) : (
        <motion.section
          initial={{ marginTop: -120 }}
          className='flex justify-center items-center gap-4 w-[calc(100%-2rem)] p-4 bg-accent rounded-md'
        >
          <h1 className='text-xs text-primary-foreground font-semibold'>{`Sign in to view ${userData?.username}'s lists.`}</h1>
        </motion.section>
      )}
    </div>
  );
};

export default Profile;
