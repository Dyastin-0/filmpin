import { useState } from 'react';

import axios from 'axios';

const Signin = () => {
  const [credentials, setCredentials] = useState({
    name: '',
    password: ''
  });

  const submit = (e) => {
    e.preventDefault();
    axios.get('/');
  }
  return (
    <div className="flex justify-center items-center">
      <form className='flex flex-col gap-2 text-sm' 
        onSubmit={submit}>
        <label htmlFor="">Username</label>
        <input type="text" className='rounded-md text-slate-900 p-2'
          value={credentials.name} onChange={(e) => setCredentials({...credentials, name: e.target.value})} />
        <label htmlFor="">Password</label>
        <input type="password" className='rounded-md text-slate-900 p-2'
          value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
        <button type='submit'>Sign in</button>
      </form>
    </div>
  )
}

export default Signin