import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import listTypes from "../../models/listTypes";
import Movie from "../Movie";
import TvShow from "../TvShow";

const ListItemSection = ({ listItems, listData, setListItems, isEditMode }) => {
  const [direction, setDirection] = useState("horizontal");

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(listItems);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setListItems(reorderedItems);
  };

  useEffect(() => {
    const updateDirection = () => {
      if (window.innerWidth < 768) {
        setDirection("vertical");
      } else {
        setDirection("horizontal");
      }
    };

    window.addEventListener("resize", updateDirection);
    updateDirection();

    return () => window.removeEventListener("resize", updateDirection);
  }, []);

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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction={direction}>
        {(provided) => (
          <section
            className={`flex ${direction === "horizontal" ? "flex-row" : "flex-col"} flex-wrap justify-center max-w-full gap-4`}
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
                      <Movie info={item} isEditMode={isEditMode} />
                    ) : (
                      <TvShow info={item} isEditMode={isEditMode} />
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
