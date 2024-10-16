import { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import listTypes from "../../models/listTypes";
import Movie from "../Movie";
import TvShow from "../TvShow";
import useAxios from "../../hooks/useAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

const TrashArea = () => {
  const { setNodeRef } = useDroppable({
    id: "trash",
  });

  return (
    <div
      ref={setNodeRef}
      id="trash"
      className="flex justify-center items-center h-[370px] w-[200px] p-2 gap-2 bg-error
      rounded-md
      text-xs font-semibold"
    >
      <FontAwesomeIcon icon={faTrash} />
      Drop an item here to delete
    </div>
  );
};

const ListItemSection = ({ listItems, listData, setListItems, isEditMode }) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const { api } = useAxios();
  const [activeId, setActiveId] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log(over);
    if (over && over.id === "trash") {
      console.log(active);
      handleDelete(active.id);
    } else if (active.id !== over.id) {
      setListItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleDelete = (id) => {
    setListItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext
        items={listItems.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <section className={`flex flex-wrap justify-center max-w-full gap-4`}>
          {listItems?.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              item={item}
              isEditMode={isEditMode}
              type={listTypes[listData?.type]}
            />
          ))}
        </section>
        {isEditMode && <TrashArea />}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="drag-overlay">
            {listTypes[listData?.type] === "Movies" ? (
              <Movie
                info={listItems.find((item) => item.id === activeId)}
                isEditMode={isEditMode}
              />
            ) : (
              <TvShow
                info={listItems.find((item) => item.id === activeId)}
                isEditMode={isEditMode}
              />
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ListItemSection;
