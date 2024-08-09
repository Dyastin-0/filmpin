import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react";
import axios from "axios";
import Movie from "../components/Movie";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [movies, setMovies] = useState(null);

  const handleGetTopMovies = async () => {
    const response = await axios.get('/movies/list/popular/page=1', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      }
    });
    setMovies(response.data.results);
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
          movies && movies.map((movie, index) => (
              <Movie key={index} info={movie} />
            )
          )
        }
      </div>
    </div>
  )
}

export default Dashboard