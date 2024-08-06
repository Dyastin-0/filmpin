import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../contexts/auth';

const Signin = () => {
  const navigate = useNavigate();
  const { setToken, setUser, user } = useAuth();

  useEffect(() => {
    user && navigate('/dashboard');
  }, [user]);

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
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form className='flex flex-col gap-2 text-sm' onSubmit={submit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          autoComplete='true'
          className="rounded-md text-slate-900 bg-slate-100 p-2"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="rounded-md text-slate-900 bg-slate-100 p-2"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default Signin;
