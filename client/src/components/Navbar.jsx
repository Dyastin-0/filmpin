import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

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
    <div className='flex justify-center p-4 gap-4'>
      { 
        user && routes.map((route, index) => (
          <Link className={`text-lg
            transition-all duration-300
            hover:cursor-pointer hover:text-slate-400
            ${location.pathname === route.path ? 'text-slate-400' : ''}
            `}
            to={route.path} key={index}> {route.name}
          </Link>
        ))
      }
      {
        !user && authRoutes.map((route, index) => (
          <Link className={`text-lg
            transition-all duration-300
            hover:cursor-pointer hover:text-slate-400
            ${location.pathname === route.path ? 'text-slate-400' : ''}
            `}
            to={route.path} key={index}> {route.name}
          </Link>
        ))
      }
      { user && <button className={`text-lg
        transition-all duration-300
        hover:cursor-pointer hover:text-slate-400`}
        onClick={handleSignout}>
          Sign out
       </button>
       }
    </div>
  )
}

export default Navbar