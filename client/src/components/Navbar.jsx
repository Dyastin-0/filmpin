import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { SearchInput } from './ui/Input';
import Button from './ui/Button';
import { Dropdown, DropdownItem } from './ui/Dropdown';

const routes = [
  { path: '/home', name: 'Home' },
  { path: '/discover', name: 'Discover' }
];
const authRoutes = [
  { path: '/sign-in', name: 'Sign in' },
  { path: '/sign-up', name: 'Sign up' }
];


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser, user } = useAuth();
  const [query, setQuery] = useState(null);

  const handleSignout = async () => {
    try {
      await axios.post('/sign-out');
      setToken(null);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) navigate(`/movies/search?query=${query.replace(/[_\s]/g, '+')}&page=${1}`);
  }

  return (
    <div className='flex justify-between bg-primary rounded-lg w-full p-3 gap-3 drop-shadow-sm z-50'>
      <Link to='/'>
        {/* <div className='flex font-semibold'>
          <h1 className='text-primary-highlight'>Film</h1>
          <h1 className='text-primary-foreground'>pin</h1>
        </div> */}
      </Link>
      <div className='flex w-fit items-center gap-3'>
        {
          user && routes.map((route, index) => (
            <Button
              key={index}
              onClick={() => navigate(route.path)}
              variant='link'
              text={route.name}
              className={`${route.path === location.pathname ? 'text-primary-highlight shadow-[var(--highlight)_0_2px_0_0]' : ''}`}
            />
          ))
        }
        {
          !user && authRoutes.map((route, index) => (
            <Button
              key={index}
              onClick={() => navigate(route.path)}
              variant='link'
              text={route.name}
              className={`${route.path === location.pathname ? 'text-primary-highlight shadow-[var(--highlight)_0_2px_0_0]' : ''}`}
            />
          ))
        }
        <div className='max-w-full'>
          {user &&
            <SearchInput
              onSubmit={handleSearch}
              type='text'
              id='search'
              placeholder='Search'
              onChange={(e) => setQuery(e.target.value)}
            />
          }
        </div>
      </div>
      <div className='flex w-fit gap-3 justify-center items-center'>
        {user &&
          <Dropdown name={user?.username}>
            <DropdownItem onClick={handleSignout} >
              Sign out
            </DropdownItem>
          </Dropdown>
        }
      </div>
    </div>
  )
}

export default Navbar;