import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Movie from '../components/Movie';
import { io } from 'socket.io-client';
import listTypes from '../models/listTypes';
import { useToast } from '../components/hooks/useToast';
import TvShow from '../components/TvShow';
import { ListBackdropDummy, ListTitleDummy } from '../components/loaders/ListSlugLoader';
import { LoadingDiscover as ListLoder } from '../components/loaders/MovieLoaders';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faGear } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../hooks/useAxios';

// Fetch functions
const fetchOwner = async (api, id) => {
  const response = await api.get(`/public/account?id=${id}`);
  return response.data.user;
};

const fetchList = async (api, id) => {
  const response = await api.get(`/list/${id}`);
  return response.data;
};

const fetchMovie = async (api, id) => {
  const response = await api.get(`/movies/details?movie_id=${id}`);
  return response.data;
};

const fetchShow = async (api, id) => {
  const response = await api.get(`/tvshows/details?show_id=${id}`);
  return response.data;
};

const ListSlug = () => {
  const { token, user } = useAuth();
  const api = useAxios();
  const [searchParams] = useSearchParams();
  const { toastInfo } = useToast();
  
  const listId = searchParams.get('list_id');

  const listQuery = useQuery({
    queryKey: ['list', listId],
    queryFn: () => fetchList(api, listId),
    enabled: !!listId && !!token,
  });

  const ownerQuery = useQuery({
    queryKey: ['owner', listQuery.data?.owner],
    queryFn: () => fetchOwner(api, listQuery.data?.owner),
    enabled: !!listQuery.data?.owner && !!token,
  });

  const listItemsQuery = useQuery({
    queryKey: ['listItems', listQuery.data?.list],
    queryFn: async () => {
      const fetchItem = listTypes[listQuery.data?.type] === 'Movies' ? fetchMovie : fetchShow;
      return Promise.all(listQuery.data?.list.map(item => fetchItem(api, item.id)));
    },
    enabled: !!listQuery.data,
  });

  useEffect(() => {
    if (token && user && listQuery.data && ownerQuery.data) {
      const randomId = crypto.randomUUID();
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        extraHeaders: { Authorization: `Bearer ${token}` },
        query: {
          owner: listQuery.data.owner,
          accessor: user._id,
          randomId,
          targetStream: 'list',
        }
      });

      newSocket.on(`stream/list/${listQuery.data.owner}/${user._id}/${randomId}`, (change) => {
        if (change.type === 'delete') {
          setListItem(prevList => prevList.filter(list => list._id !== change.list));
        } else {
          setListItem(prevList => {
            const newList = change.list.find(ojectList => !prevList.some(prevObjectList => ojectList._id === prevObjectList._id));
            if (ownerQuery.data._id !== user._id)
              toastInfo(`${ownerQuery.data?.username} just added ${newList.title} to this list.`);
            return change.list;
          });
        }
      });
      return () => newSocket.disconnect();
    }
  }, [token, listQuery.data, user, ownerQuery.data]);

  useEffect(() => {
    if (listId && token) {
      listQuery.refetch();
    }
  }, [listId, token]);

  return (
    <div className='relative flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md'>
      <div className='relative flex justify-center items-center w-full max-h-[400px] rounded-md'>
        {listQuery.isLoading ? <ListBackdropDummy /> : 
          <img
            loading='lazy'
            className='w-full h-full object-cover rounded-md'
            src={`https://image.tmdb.org/t/p/original/${listQuery.data.list[0].backdrop_path}`}
            alt={`${listQuery.data.name} backdrop`}
          />
        }
      </div>
      <motion.div
        initial={{ y: -120 }}
        className='relative flex flex-col gap-4 w-[calc(100%-2rem)] p-4 bg-accent rounded-md'
      >
        {listQuery.isLoading ? <ListTitleDummy /> :
          <div className='flex flex-col gap-4 w-full'>
            <h1 className='text-sm text-primary-foreground font-semibold'>{listQuery.data.name}</h1>
            <p className='text-xs text-primary-foreground'>{listQuery.data.description}</p>
            <div className='flex gap-1'>
              <h1 className='text-xs text-primary-foreground'>{`List of ${listTypes[listQuery.data.type]} created by`}</h1>
              <Link className='w-fit outline-none text-primary-foreground text-xs transition-colors duration-300 underline hover:text-primary-highlight focus:text-primary-highlight'
                to={`/${ownerQuery.data?.username}`}
              >
                {ownerQuery.data?.username}
              </Link>
            </div>
          </div>
        }
        <Button variant='default_rounded' icon={<FontAwesomeIcon icon={faEllipsisV} />} className='absolute w-fit top-4 right-4' />
      </motion.div>
      <motion.div
        initial={{ marginTop: -120 }}
        className='relative flex flex-col items-center gap-4 w-[calc(100%-2rem)] p-4 bg-accent rounded-md overflow-hidden'
      >
        {listItemsQuery.isLoading ? <ListLoder /> :
          <div className='flex flex-wrap justify-center gap-4'>
            {listTypes[listQuery.data?.type] === 'Movies' ?
              listItemsQuery.data?.map((item, index) => <Movie key={index} info={item} />)
              : listItemsQuery.data?.map((item, index) => <TvShow key={index} info={item} />)
            }
          </div>
        }
      </motion.div>
    </div>
  );
};

export default ListSlug;
