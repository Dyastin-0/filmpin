import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Signin from '../pages/Signin';

const ProtectedRoute = () => {
	const { token, signingIn } = useAuth();
	if (signingIn) return;
	return token ? <Outlet /> : <Signin />
}

export default ProtectedRoute;