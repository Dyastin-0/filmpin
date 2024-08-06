import { useNavigate } from "react-router";
import { useAuth } from "../contexts/auth"
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    !user && navigate('/sign-in');
  }, [user]);

  return (
    <div className="flex justify-center items-center h-full w-full">
      test
    </div>
  )
}

export default Dashboard