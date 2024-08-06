import { useState } from 'react';

import { toast } from 'react-hot-toast';

import axios from 'axios';

const Signin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const submit = (e) => {
    e.preventDefault();
    try {
      axios.get('/login');
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="flex justify-center items-center">
      <form className='flex flex-col gap-2 text-sm' 
        onSubmit={submit}>
        <label htmlFor="">Email</label>
        <input type="text" className='rounded-md text-slate-900 p-2'
          value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
        <label htmlFor="">Password</label>
        <input type="password" className='rounded-md text-slate-900 p-2'
          value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
        <button type='submit'>Sign in</button>
      </form>
    </div>
  )
}

export default Signin