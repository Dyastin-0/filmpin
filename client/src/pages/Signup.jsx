import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const { setToken, setUser, token } = useAuth();
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
  const [signingUp, setSigningUp] = useState(false);

  useEffect(() => {
    token && navigate('/home');
  }, [token]);

  useEffect(() => {
    setIsPasswordMatched(confirmedPassword === credentials.password);
  }, [confirmedPassword, credentials.password]);

  useEffect(() => {
    usernameRef.current.focus();
    document.title = 'Sign up';
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

    setSigningUp(true);

    try {
      const { data } = await axios.post('/sign-up', {
        username, email, password,
      });
      setToken(data.accessToken);
      setUser(data.user);
      setCredentials({ username: '', email: '', password: '' });
      setConfirmedPassword('');
      toastSuccess('Sign up success! Check your email for the verification link.');
      navigate('/sign-in', {state: { from: '/sign-up' }});
    } catch (error) {
      toastError('Email already used.');
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <div className='flex flex-col p-4 justify-center items-center h-full w-full text-primary bg-primary rounded-lg'>
      <form
        className='flex flex-col w-[250px] max-w-full p-4 text-xs text-primary-foreground bg-accent drop-shadow-sm rounded-md'
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
          className={`${!testEmail(credentials.email) && credentials.email !== '' ? 'shadow-[0px_2px_0_0] shadow-error' : ''}`}
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
            className={`${!isPasswordmatched && credentials.password ? 'shadow-[2px_2px_0_0] shadow-error' : ''}`}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          {
            credentials.password && <ShowPassword showPassword={showPassword} setShowPassword={setShowPassword} />
          }
        </div>

        <ProgressBar value={passwordStrength.strength} text={passwordStrength.message} visible={credentials.password} />

        <div className="relative">
          <Input
            placeholder='Confirm password'
            required={true}
            id='confirm_password'
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmedPassword}
            className={`${!isPasswordmatched && confirmedPassword ? 'shadow-[2px_2px_0_0] shadow-error' : ''}`}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
          {
            confirmedPassword && <ShowPassword showPassword={showConfirmPassword} setShowPassword={setShowConfirmPassword} />
          }
        </div>
        <Button type='submit' disabled={signingUp} text={`${signingUp ? 'Signing up...' : 'Sign up'}`} />
        <Link
          to={`/sign-in`}
          className='self-center w-fit pt-1 outline-none text-primary-foreground text-xs transition-colors duration-300 focus:text-primary-highlight focus:underline'
        > Already have an account? click here. </Link>
      </form>
    </div>
  );
};

export default Signup;
