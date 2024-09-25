import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import listTypes from "../../models/listTypes";
import Movie from "../Movie";
import TvShow from "../TvShow";

const ListItemSection = ({ listItems, listData, setListItems, isEditMode }) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(listItems);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setListItems(reorderedItems);
  };

  if (!isEditMode) {
    return (
      <section className="flex flex-wrap justify-center gap-4">
        {listTypes[listData?.type] === "Movies"
          ? listItems?.map((item, index) => <Movie key={index} info={item} />)
          : listItems?.map((item, index) => <TvShow key={index} info={item} />)}
      </section>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided) => (
          <section
            className="flex flex-wrap justify-center max-w-full gap-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {listItems?.map((item, index) => (
              <Draggable key={index} draggableId={String(index)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="draggable-item"
                  >
                    {listTypes[listData?.type] === "Movies" ? (
                      <Movie info={item} />
                    ) : (
                      <TvShow info={item} />
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </section>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListItemSection;
