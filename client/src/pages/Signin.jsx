import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ShowPassword } from '../components/utils/ShowPassword';
import { useToast } from '../components/hooks/useToast';
import useAxios from '../hooks/useAxios';
import { AnimatePresence, motion } from 'framer-motion';

const Signin = () => {
  const api = useAxios();
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [signingIn, setSigningIn] = useState(false);
  const { setToken, setUser, user } = useAuth();
  const { toastError, toastSuccess } = useToast();
  const [backdrops, setBackdrops] = useState(null);
  const [backdropIndex, setBackdropIndex] = useState(0);

  const previousPath = location.state?.from || '/home';

  const getBackdrops = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/public/backdrops?category=movie&list=top_rated&page=1`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    document.title = 'Sign in';
    getBackdrops().then(response => {
      setBackdrops(response);
    });
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    user && navigate('/home');
  }, [user]);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    setSigningIn(true);
    try {
      const { data } = await axios.post('/sign-in', { email, password });
      setToken(data.accessToken);
      setUser(data.user);
      toastSuccess('Signed in!');
      setCredentials({ email: '', password: '' });
      navigate(previousPath);
    } catch (error) {
      const errorMessage = error.response.data.message;
      toastError(`${errorMessage}`);
    } finally {
      setSigningIn(false);
    }
  };

  useEffect(() => {
		if (backdrops) {
			const intervalId = setInterval(() => {
				setBackdropIndex((prevIndex) => (prevIndex + 1) % backdrops.length);
			}, 3000);

			return () => clearInterval(intervalId);
		}
	}, [backdrops]);

  return (
    <div
      className='relative flex flex-col p-4 justify-center items-center h-full w-full
      text-primary bg-primary rounded-xl overflow-hidden'
    >
      <AnimatePresence>
        { backdrops &&
          <motion.img
            key={backdrops[backdropIndex]}
            src={`https://image.tmdb.org/t/p/original${backdrops[backdropIndex]}`}
            className='absolute w-full h-full z-10 rounded-lg object-cover blur-[2px]'
            style={{clipPath: 'inset(2px)'}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        }
      </AnimatePresence>
      <form
        className='flex flex-col w-[250px] max-w-full p-4 text-xs text-primary-foreground
        bg-accent drop-shadow-sm rounded-md z-10'
        onSubmit={submit}
      >
        <h2 className='w-full text-center pb-4 text-lg font-bold'>
          Sign in to Filmpin
        </h2>
        <Input
          required={true}
          type='email'
          placeholder='Email'
          id='email'
          ref={emailRef}
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
        <div className='relative'>
          <Input
            required={true}
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            id='password'
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            value={credentials.password}
          />
          {
            credentials.password && <ShowPassword showPassword={showPassword} setShowPassword={setShowPassword} />
          }
        </div>
        <Link
          to={`/account/recover`}
          className='underline underline-offset-2 pb-2 outline-none text-primary-highlight text-xs'
        > Forgot password? </Link>
        <Button type='submit' disabled={signingIn} text={`${signingIn ? 'Signing in...' : 'Sign in'}`} />
        <Link
          to={`/account/verify`}
          className='underline underline-offset-2 text-center pt-1 pb-1 outline-none text-primary-highlight text-xs'
        > Verify your account </Link>
        <Link
          to={`/sign-up`}
          className='underline underline-offset-2 text-center pt-1 pb-1 outline-none text-primary-highlight text-xs'
        > Don't have an account? click here </Link>
      </form>
    </div>
  );
};

export default Signin;
