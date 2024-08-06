import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import axios from 'axios';
import { useAuth } from '../contexts/auth';

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    user && navigate('/dashboard');
  }, [user]);

  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: ''
  });

  const submit = async (e) => {
    e.preventDefault();
    const {username, email, password} = credentials;
    try {
      const { data } = await axios.post('/signup', {
        username, email, password
      });
      
      setCredentials({});
      toast.success('Sign up success!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Sign up failed.');
    }
  }
  return (
    <div className="flex justify-center items-center">
      <form className='flex flex-col gap-2 text-sm' 
        onSubmit={submit}>
        <label htmlFor="">Username</label>
        <input type="text" className='rounded-md text-slate-900 p-2'
          value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})} />
        <label htmlFor="">Email</label>
        <input type="email" className='rounded-md text-slate-900 p-2'
          value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
        <label htmlFor="">Password</label>
        <input type="password" className='rounded-md text-slate-900 p-2'
          value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
        <button type='submit'>Sign up</button>
      </form>
    </div>
  )
}

export default Signup