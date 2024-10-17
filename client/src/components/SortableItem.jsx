import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Movie from "./Movie";
import TvShow from "./TvShow";

const SortableItem = ({ id, item, isEditMode, type }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="draggable-item"
    >
      {type === "Movies" ? (
        <Movie info={item} isEditMode={isEditMode} />
      ) : (
        <TvShow info={item} isEditMode={isEditMode} />
      )}
    </div>
  );
};

export default SortableItem;
