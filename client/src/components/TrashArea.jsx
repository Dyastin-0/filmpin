import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useDroppable } from "@dnd-kit/core";
import Button from "./ui/Button";

const TrashArea = ({ deletedItems, setDeletedItems, setListItems }) => {
  const { setNodeRef } = useDroppable({
    id: "trash",
  });

  const handleRemove = (item) => {
    setListItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(item.originalIndex, 0, item);
      return newItems;
    }, false);
    setDeletedItems((prevDeleted) =>
      prevDeleted.filter((listItem) => listItem.id !== item.id)
    );
  };

  return (
    <div
      ref={setNodeRef}
      id="trash"
      className="flex flex-col h-[370px] w-[200px] p-4 gap-2
      text-primary-foreground border border-secondary-accent
      rounded-md
      text-xs font-semibold"
    >
      <div className="flex w-full justify-center text-xs gap-2">
        <FontAwesomeIcon icon={faTrash} />
        <span>Drop here to delete.</span>
      </div>
      {deletedItems &&
        deletedItems.length > 0 &&
        deletedItems.map((item) => (
          <div
            className="flex justify-between items-center p-2
                    font-semibold rounded-md border border-secondary-accent"
            key={item.id}
          >
            <span>{item.title}</span>
            <Button
              text={<FontAwesomeIcon icon={faUndo} />}
              variant="default_rounded"
              onClick={() => handleRemove(item)}
            />
          </div>
        ))}
    </div>
  );
};

export default TrashArea;
