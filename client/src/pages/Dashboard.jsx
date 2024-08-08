import { useNavigate } from "react-router";
import { useAuth } from "../contexts/auth"
import { useEffect, useState } from "react";
import axios from "axios";
import Movie from "../components/Movie";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [topMovies, setTopMovies] = useState(null);

  const handleGetTopMovies = async () => {
    const response = await axios.get('/movies/top-rated', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setTopMovies(response.data.results);
  }

  useEffect(() => {
    !user && navigate('/sign-in');
  }, [user]);

  return (
    <div className="flex flex-col gap-1 justify-center items-center h-full w-full">
      <h1> { user?.username } </h1>
      <h1> { user?.email } </h1>
      <button className="transition-all duration-300 p-1 rounded-md hover:bg-slate-600"
        onClick={handleGetTopMovies}
      > Top Movies </button>
      <div className='flex flex-wrap-reverse gap-4 justify-center'>
        { 
          topMovies && topMovies.map(movie => (
              <Movie info={movie} />
            )
          )
        }
      </div>
    </div>
  )
}

export default Dashboard