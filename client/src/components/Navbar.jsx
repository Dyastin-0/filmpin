import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import SearchInput from './ui/SearchInput';
import Button from './ui/Button';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { useThemeToggle } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import SideNavbar from './SideNavbar';

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
  const { toggleTheme, icon } = useThemeToggle();
  const { setToken, token, setUser, user } = useAuth();
  const [query, setQuery] = useState(null);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [viewWidth, setViewWidth] = useState(window.innerWidth);
  const [opensideNavbar, setOpenSideNavbar] = useState(false);

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

  const toggleSideNavbar = () => setOpenSideNavbar(!opensideNavbar);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleResize = () => setViewWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewWidth]);

  return (
    <motion.div
      className={`sticky top-4 flex justify-between rounded-lg w-full p-3 gap-3 shadow-sm z-40 bg-primary
      ${lastScrollY > 50 ? 'border border-secondary-accent' : ''}`}
      initial={{ y: 0 }}
      animate={isScrollingDown ? { y: -100 } : { y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className='flex justify-center items-center gap-2'>
        {viewWidth < 500 && <FontAwesomeIcon icon={faBars} onClick={toggleSideNavbar} className='hover:cursor-pointer' />}
        <Link className='outline-none' to='/'>
          <div className='flex justify-center items-center h-full font-semibold'>
            <h1 className='text-md text-primary-highlight'>Film</h1>
            <h1 className='text-md text-primary-foreground'>pin</h1>
          </div>
        </Link>
      </div>
      <SideNavbar isOpen={opensideNavbar} toggle={toggleSideNavbar} authRoutes={authRoutes} routes={routes} token={token} />
      <div className='flex w-fit items-center gap-3'>
        {token && viewWidth > 500 && routes.map((route, index) => (
          <Button
            key={index}
            onClick={() => navigate(route.path)}
            variant='link'
            text={route.name}
            className={`${route.path === location.pathname ? 'text-primary-highlight shadow-[var(--highlight)_0_2px_0_0]' : ''}`}
          />
        ))}
        {!token && viewWidth > 500 && authRoutes.map((route, index) => (
          <Button
            key={index}
            onClick={() => navigate(route.path)}
            variant='link'
            text={route.name}
            className={`${route.path === location.pathname ? 'text-primary-highlight shadow-[var(--highlight)_0_2px_0_0]' : ''}`}
          />
        ))}
        <div className='max-w-full'>
          {token &&
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
        <Button variant='default_rounded' icon={icon} onClick={toggleTheme} className='p-2' />
        {token &&
          <Dropdown
            name={user.profileImageURL ?
              <img className='max-w-[30px] max-h-[30px] rounded-full' src={user.profileImageURL} />
              : <div className='flex justify-center items-center w-[30px] h-[30px] rounded-full bg-secondary text-primary-highlight text-xs'>
                {user.username[0]}
              </div>
            }
          >
            <DropdownItem onClick={() => navigate(`/${user.username}`)}>
              Profile
            </DropdownItem>
            <DropdownItem onClick={handleSignout}>
              Sign out
            </DropdownItem>
          </Dropdown>
        }
      </div>
    </motion.div>
  );
}

export default Navbar;
