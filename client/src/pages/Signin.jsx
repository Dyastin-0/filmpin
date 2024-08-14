import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signin = () => {
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { setToken, setUser, user } = useAuth();

  const previousPath = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    user && navigate('/dashboard');
  }, [user]);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const submit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    try {
      const { data } = await axios.post('/sign-in', { email, password });
      setToken(data.accessToken);
      setUser(data.user);
      toast.success('Signed in!');
      setCredentials({ email: '', password: '' });
      navigate(previousPath, { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col p-4 justify-center items-center h-full w-full
      text-primary
      bg-primary rounded-xl'
    >
      <form className='flex flex-col w-[250px] p-4  text-xs text-primary-foreground
      bg-accent drop-shadow-sm rounded-md'
        onSubmit={submit}>
        <h2 className='w-full text-center pb-4 text-lg font-bold' >Log in to Filmpin</h2>
        <Input
          type='email'
          placeholder='Email'
          id='email'
          ref={emailRef}
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
        <Input
          type='password'
          placeholder='Password'
          id='password'
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          value={credentials.password}
        />
        <Button type='submit' text='Sign in' />
      </form>
    </div>
  );
};

export default Signin;
