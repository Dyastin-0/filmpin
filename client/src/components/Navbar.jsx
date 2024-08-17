import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { SearchInput } from './ui/Input';
import Button from './ui/Button';
import { Dropdown, DropdownItem } from './ui/Dropdown';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser, user } = useAuth();

  const handleSignout = async () => {
    try {
      await axios.post('/sign-out');
      setToken(null);
      setUser(null);
      navigate('/sign-in');
    } catch (error) {
      console.error(error);
    }
  }

  const routes = [
    {path: '/dashboard', name: 'Dashboard'}
  ]
  const authRoutes = [
    {path: '/sign-in', name: 'Sign in'},
    {path: '/sign-up', name: 'Sign up'}
  ]
  return (
    <div className='flex justify-between bg-primary rounded-lg w-full p-3 gap-3 drop-shadow-sm z-50'>
      <div></div>
      <div className='flex w-fit gap-3'>
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
      <div className='w-[200px] max-w-full'>
        <SearchInput placeholder='Search' />
      </div>
      </div>
      <div className='flex w-fit gap-3 justify-center items-center'>
        <Dropdown name={user?.username}>
            <DropdownItem onClick={handleSignout}>
              Sign out
            </DropdownItem>
        </Dropdown>
      </div>
    </div>
  )
}

export default Navbar;