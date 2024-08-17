import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import Input, { SearchInput } from './ui/Input';
import Button from './ui/Button';

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
    <div className='flex justify-center bg-primary rounded-lg w-full p-4 gap-4 drop-shadow-sm'>
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
      { user && <Button onClick={handleSignout} variant='link' text='Sign out' />
       }
       <form>
          <SearchInput placeholder='Search' />
       </form>
    </div>
  )
}

export default Navbar;