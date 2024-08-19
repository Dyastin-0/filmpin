import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { testEmail, testPassword, testUsername } from '../helpers/regex';
import ProgressBar from '../components//ui/ProgressBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ShowPassword } from '../components/utils/ShowPassword';
import { useToast } from '../components/hooks/useToast';

const Signup = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const usernameRef = useRef(null);
  const { toastError, toastSuccess } = useToast();

  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [isPasswordmatched, setIsPasswordMatched] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, color: 'red', message: 'Very weak' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setIsPasswordMatched(confirmedPassword === credentials.password);
  }, [confirmedPassword, credentials.password]);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    credentials.password && setPasswordStrength(testPassword(credentials.password));
  }, [credentials.password]);

  const submit = async (e) => {
    e.preventDefault();
    const { username, email, password } = credentials;

    if (!testUsername(credentials.username)) return toastError('Invalid username.');
    if (!testEmail(credentials.email)) return toastError('Invalid email format.');
    if (passwordStrength.strength < 25) return toastError(`Password should at least be 'Good.'`);
    if (!isPasswordmatched) return toastError('Passwords do not match.');

    try {
      const { data } = await axios.post('/sign-up', {
        username, email, password,
      });
      setToken(data.accessToken);
      setUser(data.user);
      setCredentials({ username: '', email: '', password: '' });
      setConfirmedPassword('');
      toastSuccess('Sign up success!');
      navigate('/home');
    } catch (error) {
      toastError('Email already used.');
    }
  };

  return (
    <div className='flex flex-col p-4 justify-center items-center h-full w-full text-primary bg-primary rounded-xl'>
      <form
        className='flex flex-col w-[250px] p-4 text-xs text-primary-foreground bg-accent drop-shadow-sm rounded-md'
        onSubmit={submit}
      >
        <h2 className='w-full text-center pb-4 text-lg font-bold'>Create your account</h2>
        
        <Input
          ref={usernameRef}
          placeholder='Username'
          required={true}
          id='username'
          type='text'
          autoComplete='off'
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />

        <Input
          placeholder='Email'
          id='email'
          required
          type='email'
          autoComplete='on'
          className={`${!testEmail(credentials.email) && credentials.email !== '' ? 'shadow-[var(--error)_0px_2px_0_0]' : ''}`}
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />

        <div className="relative">
          <Input
            placeholder='Password'
            required={true}
            id='password'
            type={showPassword ? 'text' : 'password'}
            value={credentials.password}
            className={`${!isPasswordmatched && credentials.password ? 'shadow-[var(--error)_0px_2px_0_0]' : ''}`}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <ShowPassword showPassword={showPassword} setShowPassword={setShowPassword} />
        </div>

        <ProgressBar value={passwordStrength.strength} text={passwordStrength.message} visible={credentials.password} />

        <div className="relative">
          <Input
            placeholder='Confirm password'
            required={true}
            id='confirm_password'
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmedPassword}
            className={`${!isPasswordmatched && confirmedPassword ? 'shadow-[var(--error)_0px_2px_0_0]' : ''}`}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
          <ShowPassword showPassword={showConfirmPassword} setShowPassword={setShowConfirmPassword} />
        </div>

        <Button type='submit' text='Sign up' />
      </form>
    </div>
  );
};

export default Signup;
