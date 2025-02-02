import { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import listTypes from "../../models/listTypes";
import Movie from "../Movie";
import TvShow from "../TvShow";
import SortableItem from "../SortableItem";
import TrashArea from "../TrashArea";

const ListItemSection = ({
  listItems,
  listInfo,
  setListItems,
  isEditMode,
  deletedItems,
  setDeletedItems,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeId, setActiveId] = useState(null);

  const handleDelete = (id) => {
    const itemToDelete = listItems.find((item) => item.id === id);
    const originalIndex = listItems.findIndex((item) => item.id === id);
    setListItems(
      (prevItems) => prevItems.filter((item) => item.id !== id),
      false
    );
    setDeletedItems((prevDeleted) => [
      ...prevDeleted,
      { ...itemToDelete, originalIndex },
    ]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id === "trash") {
      handleDelete(active.id);
    } else if (active.id !== over.id) {
      setListItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      }, false);
    }
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => setActiveId(active.id)}
    >
      <SortableContext
        items={listItems.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <section className={`flex flex-wrap justify-center max-w-full gap-4`}>
          {isEditMode && (
            <TrashArea
              deletedItems={deletedItems}
              setDeletedItems={setDeletedItems}
              setListItems={setListItems}
            />
          )}
          {listItems?.map((item) =>
            isEditMode ? (
              <SortableItem
                key={item.id}
                id={item.id}
                item={item}
                isEditMode={isEditMode}
                type={listTypes[listInfo?.type]}
              />
            ) : listTypes[listInfo?.type] === "Movies" ? (
              <Movie info={item} key={item.id} />
            ) : (
              <TvShow info={item} key={item.id} />
            )
          )}
        </section>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="drag-overlay">
            {listTypes[listInfo?.type] === "Movies" ? (
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
