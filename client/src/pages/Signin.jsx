import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ShowPassword } from '../components/utils/ShowPassword';
import { useToast } from '../components/hooks/useToast';
import useAxios from '../hooks/useAxios';

const Signin = () => {
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [signingIn, setSigningIn] = useState(false);
  const { setToken, setUser, user } = useAuth();
  const { toastError, toastSuccess } = useToast();

  const previousPath = location.state?.from || '/home';

  useEffect(() => {
    document.title = 'Sign in';
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

  return (
    <div className='flex flex-col p-4 justify-center items-center h-full w-full text-primary bg-primary rounded-lg'>
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
