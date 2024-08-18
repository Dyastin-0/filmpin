import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
	const { token, signingIn } = useAuth();
	if (signingIn) return;
	return token ? <Outlet /> : <Navigate to='/home' />
}

export default ProtectedRoute;