import { useNavigate } from "react-router";
import { useAuth } from "../contexts/auth"
import { useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const handleAdmin = async () => {
    try {
      await axios.get('/admin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    !user && navigate('/sign-in');
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <h1> { user?.username } </h1>
      <h1> { user?.email } </h1>
      <button className='p-1 rounded-md transition-all duration-300 hover:bg-slate-600'
        onClick={handleAdmin}
      >
        Admin
      </button>
    </div>
  )
}

export default Dashboard