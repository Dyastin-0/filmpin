import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./ui/Button";
import { faX } from "@fortawesome/free-solid-svg-icons";

const Frame = ({ youtubeKey, title, onClose }) => {
	return (
		<div className='flex flex-col items-end w-[800px] max-h-full max-w-full p-4 gap-4 bg-primary rounded-md aspect-video'>
			<div className='text-xs'><Button icon={<FontAwesomeIcon icon={faX} />} onClick={onClose} /></div>
			<iframe
				className='w-full h-full rounded-lg'
				src={`https://youtube.com/embed/${youtubeKey}`}
				title={title}
				allowFullScreen
			/>
		</div>
	);
}

export default Frame;