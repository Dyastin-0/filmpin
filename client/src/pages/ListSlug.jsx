import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Movie from '../components/Movie';
import { io } from 'socket.io-client';
import listTypes from '../models/listTypes';
import { useToast } from '../components/hooks/useToast';
import TvShow from '../components/TvShow';
import { ListBackdropDummy, ListTitleDummy } from '../components/loaders/ListSlugLoader';
import { LoadingDiscover as ListLoader } from '../components/loaders/MovieLoaders';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import useAxios from '../hooks/useAxios';
import { fetchList, fetchOwner, fetchMovie, fetchShow } from '../helpers/api';

const ListSlug = () => {
  const { token, user } = useAuth();
  const api = useAxios();
  const [searchParams] = useSearchParams();
  const { toastInfo } = useToast();

  const listId = searchParams.get('list_id');
  const [listData, setListData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchListData = async () => {
      if (!listId || !token) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const listResponse = await fetchList(api, listId);
        setListData(listResponse);

        if (listResponse.owner) {
          const ownerResponse = await fetchOwner(api, listResponse.owner);
          setOwnerData(ownerResponse);
        }

        const fetchItem = listTypes[listResponse.type] === 'Movies' ? fetchMovie : fetchShow;
        const itemsResponses = await Promise.all(listResponse.list.map(item => fetchItem(api, item.id)));
        setListItems(itemsResponses);

      } catch (error) {
        setIsError(true);
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListData();
  }, [listId, token]);

  useEffect(() => {
    if (token && user && listData && ownerData) {
      const randomId = crypto.randomUUID();
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        extraHeaders: { Authorization: `Bearer ${token}` },
        query: {
          owner: listData.owner,
          accessor: user._id,
          randomId,
          targetStream: 'list',
        }
      });

      newSocket.on(`stream/list/${listData.owner}/${user._id}/${randomId}`, (change) => {
        if (change.type === 'delete') {
          setListItems(prevList => prevList.filter(item => item._id !== change.list));
        } else {
          setListItems(prevList => {
            const newList = change.list.find(ojectList => !prevList.some(prevObjectList => ojectList._id === prevObjectList._id));
            if (ownerData._id !== user._id) {
              toastInfo(`${ownerData?.username} just added ${newList.title} to this list.`);
            }
            return change.list;
          });
        }
      });

      return () => newSocket.disconnect();
    }
  }, [token, listData, user, ownerData]);

  return (
    <div className='relative flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md'>
      <div className='relative flex justify-center items-center w-full max-h-[400px] rounded-md'>
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
        {isLoading ? <ListBackdropDummy /> :
          <img
            loading='lazy'
            className='w-full h-full object-cover rounded-md'
            src={listData?.list[0]?.backdrop_path ? `https://image.tmdb.org/t/p/original/${listData.list[0].backdrop_path}` : ''}
            alt={`${listData?.name} backdrop`}
          />
        }
      </div>
      <motion.div
        initial={{ y: -120 }}
        className='relative flex flex-col gap-4 w-[calc(100%-2rem)] p-4 rounded-md'
      >
        {isLoading ? <ListTitleDummy /> :
          <div className='flex flex-col gap-4 w-full'>
            <h1 className='text-sm text-primary-foreground font-semibold'>{listData?.name}</h1>
            <p className='text-xs text-primary-foreground'>{listData?.description}</p>
            <div className='flex gap-1'>
              <h1 className='text-xs text-primary-foreground'>{`List of ${listTypes[listData?.type]} by`}</h1>
              <Link className='w-fit outline-none text-primary-foreground text-xs transition-colors duration-300 underline hover:text-primary-highlight focus:text-primary-highlight'
                to={`/${ownerData?.username}`}
              >
                {ownerData?.username}
              </Link>
            </div>
          </div>
        }
      </motion.div>
      <motion.div
        initial={{ marginTop: -120 }}
        className='relative flex flex-col items-center gap-4 w-[calc(100%-2rem)] p-4 rounded-md overflow-hidden'
      >
        {isLoading ? <ListLoader /> :
          <div className='flex flex-wrap justify-center gap-4'>
            {listTypes[listData?.type] === 'Movies' ?
              listItems.map((item, index) => <Movie key={index} info={item} />)
              : listItems.map((item, index) => <TvShow key={index} info={item} />)
            }
          </div>
        }
      </motion.div>
    </div>
  );
};

export default ListSlug;
