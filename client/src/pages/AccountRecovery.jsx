import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ShowPassword } from '../components/utils/ShowPassword';
import { useToast } from '../components/hooks/useToast';
import { testPassword } from '../helpers/regex';
import ProgressBar from '../components/ui/ProgressBar';

const AccountRecovery = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const passwordRef = useRef(null);
	const [credentials, setCredentials] = useState({
		password: '',
	});

	const recoveryToken = searchParams.get('recoveryToken');

	const [confirmedPassword, setConfirmedPassword] = useState('');
	const [isPasswordMatched, setIsPasswordMatched] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState({ strength: 0, color: 'red', message: 'Very weak' });
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const { toastError, toastSuccess } = useToast();

	useEffect(() => {
		passwordRef.current.focus();
		document.title = 'Account Recovery';
	}, []);

	useEffect(() => {
		setIsPasswordMatched(confirmedPassword === credentials.password);
	}, [confirmedPassword, credentials.password]);

	useEffect(() => {
		setPasswordStrength(testPassword(credentials.password));
	}, [credentials.password]);

	const submit = async (e) => {
		e.preventDefault();

		if (!recoveryToken) return toastError('Missing recovery token.');

		if (passwordStrength.strength < 25) {
			return toastError(`Password should at least be 'Good.'`);
		}

		if (!isPasswordMatched) {
			return toastError('Passwords do not match.');
		}

		setSubmitting(true);

		try {
			const { data } = await axios.post(`/email/recover?recoveryToken=${recoveryToken}`, {
				password: credentials.password,
			});
			toastSuccess(data.message);
			navigate('/sign-in');
		} catch (error) {
			const errorMessage = error.response?.data?.message || 'Failed to recover your account.';
			toastError(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className='flex flex-col p-4 justify-center items-center h-full w-full text-primary-foreground bg-primary rounded-xl'>
			<form
				className='flex flex-col w-[250px] max-w-full p-4 text-xs text-primary-foreground border border-secondary-accent rounded-md'
				onSubmit={submit}
			>
				<h2 className='w-full text-center pb-4 text-lg font-bold'>Account Recovery</h2>

				<div className="relative">
					<Input
						ref={passwordRef}
						placeholder='New Password'
						required
						id='password'
						type={showPassword ? 'text' : 'password'}
						value={credentials.password}
						className={`${!isPasswordMatched && credentials.password ? 'shadow-[2px_2px_0_0] shadow-error' : ''}`}
						onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
					/>
					{credentials.password && (
						<ShowPassword showPassword={showPassword} setShowPassword={setShowPassword} />
					)}
				</div>

				<ProgressBar value={passwordStrength.strength} text={passwordStrength.message} visible={credentials.password} />

				<div className="relative">
					<Input
						placeholder='Confirm Password'
						required
						id='confirm_password'
						type={showConfirmPassword ? 'text' : 'password'}
						value={confirmedPassword}
						className={`${!isPasswordMatched && confirmedPassword ? 'shadow-[2px_2px_0_0] shadow-error' : ''}`}
						onChange={(e) => setConfirmedPassword(e.target.value)}
					/>
					{confirmedPassword && (
						<ShowPassword showPassword={showConfirmPassword} setShowPassword={setShowConfirmPassword} />
					)}
				</div>

				<Button type='submit' disabled={submitting} text={`${submitting ? 'Updating...' : 'Update Password'}`} />
			</form>
		</div>
	);
};

export default AccountRecovery;
