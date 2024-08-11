import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react";
import axios from "axios";
import Movie from "../components/Movie";

const Home = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [movies, setMovies] = useState(null);

  const handleGetTopMovies = async () => {
    const response = await axios.get('/movies/list/top_rated/page=1', {
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

  useEffect(() => {
    user && handleGetTopMovies();
  }, []);

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-1 p-4 justify-center items-center h-full w-full">
      <section className='flex flex-wrap justify-center gap-4 w-full'>
        {
          movies && movies.map((movie, index) => <Movie key={index} info={movie} />)
        }
      </section>
    </div>
  )
}

export default Home