import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const routes = [
    {path: '/dashboard', name: 'Dashboard'},
    {path: '/signin', name: 'Sign in'},
    {path: '/signup', name: 'Sign up'}
  ]
  return (
    <div className='flex justify-center p-4 gap-4'>
      {routes.map((route, index) => (
        <Link className={`text-lg
          transition-all duration-300
          hover:cursor-pointer hover:text-slate-400
          ${location.pathname === route.path ? 'text-slate-400' : ''}
          `}
          to={route.path} key={index}> {route.name}
        </Link>
      ))}
    </div>
  )
}

export default Navbar