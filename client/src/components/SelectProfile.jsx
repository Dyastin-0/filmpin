import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import useAxios from '../hooks/useAxios';
import Button from './ui/Button';
import { useToast } from '../components/hooks/useToast';

const SelectProfile = () => {
	const { user, setUser } = useAuth();
	const api = useAxios();
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState('');
	const [uploading, setUploading] = useState(false);
	const { toastError, toastSuccess } = useToast();
	const inputRef = useRef(null);

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		setFile(selectedFile);
		setPreview(URL.createObjectURL(selectedFile));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!file) {
			toastError(`You haven't selected an image yet.`);
			return;
		}
		if (uploading) return;

		setUploading(true);
		
		const formData = new FormData();
		formData.set('imageFile', file)
		try {
			const response = await api.post(`/account/set-profile?user_id=${user._id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setUser(prev => ({
				...prev,
				profileImageURL: response.secure_url
			}))
			toastSuccess('Profile updated.');
		} catch (error) {
			console.error('Error uploading file:', error);
			toastError('Failed to update profile.');
		} finally {
			setUploading(false);
		}
	};

	useEffect(() => {
		inputRef.current.focus();
	}, []);

	return (
		<div className='flex flex-col items-center w-[400px] h-fit max-w-full p-4 gap-4 bg-primary rounded-md overflow-hidden'>
			<h1 className='text-center text-xs font-semibold'>Upload Profile</h1>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit}
			>
				<input
					ref={inputRef}
					type='file'
					accept='image/*'
					name='imageFile'
					className='text-xs text-primary-foreground outline-none focus:shadow-[var(--highlight)_0_0_0_2px] rounded-md
					transition-all duration-300
					hover:cursor-pointer hover:shadow-[var(--highlight)_0_0_0_2px]
					file:bg-primary-highlight file:border-none file:p-1 file:outline-none
					file:transition-all file:duration-300
					file:hover:cursor-pointer file:hover:opacity-90 file:active:opacity-70'
					onChange={handleFileChange}
				/>
				<Button type='submit' text={`${uploading ? 'Uploading...' : 'Upload'}`} />
			</form>
			{preview && (
				<img
					src={preview}
					alt='Preview'
					className='w-[200px] h-[200px] rounded-full'
				/>
			)}
		</div>
	);
};

export default SelectProfile;
