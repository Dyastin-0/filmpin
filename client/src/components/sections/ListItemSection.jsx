import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
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

const ListItemSection = ({ listItems, listData, setListItems, isEditMode }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setListItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!isEditMode) {
    return (
      <section className="flex flex-wrap justify-center gap-4">
        {listTypes[listData?.type] === "Movies"
          ? listItems?.map((item, index) => (
              <Movie key={index} info={item} isEditMode={isEditMode} />
            ))
          : listItems?.map((item, index) => (
              <TvShow key={index} info={item} isEditMode={isEditMode} />
            ))}
      </section>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
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
      </SortableContext>
    </DndContext>
  );
};

export default ListItemSection;
