import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { testEmail, testPassword, testUsername } from '../helpers/regex';
import ProgressBar from '../components//ui/ProgressBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
  const navigate = useNavigate();
  const { setToken, setUser, user } = useAuth();
  const usernameRef = useRef(null);

  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({strength: 0, color: 'red', message: 'Very weak'});

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    credentials.password && setPasswordStrength(testPassword(credentials.password));
  }, [credentials.password]);

  useEffect(() => {
    user && navigate('/dashboard');
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    const {username, email, password} = credentials;

    if (!testUsername(credentials.username)) return toast.error('Invalid username.');
    if (!testEmail(credentials.email)) return toast.error('Invalid email format.');
    if (passwordStrength.strength < 25) return toast.error(`Password should at least be 'Good.'`);
    if (credentials.password !== confirmedPassword) return toast('Passwords do not match.');

    try {
      const { data } = await axios.post('/sign-up', {
        username, email, password
      });
      setToken(data.token);
      setUser(data.user);
      setCredentials({ username: '', email: '', password: '' });
      setConfirmedPassword('');
      toast.success('Sign up success!');
      navigate('/home');
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  return (
    <div className='flex flex-col p-4 justify-center items-center h-full w-full
      text-primary
      bg-primary rounded-xl'
    >
      <form className='flex flex-col w-[250px] p-4  text-xs text-primary-foreground
      bg-accent drop-shadow-sm rounded-md'
        onSubmit={submit}>
        <h2 className='w-full text-center pb-4 text-lg font-bold' >Create your account</h2>
        <Input
          ref={usernameRef}
          placeholder='Username'
          required={true}
          id='username'
          type='text'
          autoComplete='off'
          className='rounded-md text-slate-900 bg-slate-100 p-2'
          value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        />
        <Input
          placeholder='Email'
          required={true}
          id='email'
          type='email'
          autoComplete='on'
          className='rounded-md text-slate-900 bg-slate-100 p-2'
          value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        />
        <Input
          placeholder='Password'
          required={true}
          id='password'
          type='password'
          className='rounded-md text-slate-900 bg-slate-100 p-2'
          value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        { <ProgressBar value={passwordStrength.strength} text={passwordStrength.message} visible={credentials.password} /> }
        <Input
          placeholder='Confirm password'
          required={true}
          id='confirm_password'
          type='password'
          className='rounded-md text-slate-900 bg-slate-100 p-2'
          value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)}
        />
        <Button type='submit' text='Sign up' />
      </form>
    </div>
  )
}

export default Signup;