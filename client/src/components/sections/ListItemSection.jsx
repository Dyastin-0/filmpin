import React from "react";
import listTypes from "../../models/listTypes";
import Movie from "../Movie";
import TvShow from "../TvShow";

const ListItemSection = ({ listItems, listData }) => {
  return (
    <section className="flex flex-wrap justify-center gap-4">
      {listTypes[listData?.type] === "Movies"
        ? listItems?.map((item, index) => <Movie key={index} info={item} />)
        : listItems?.map((item, index) => <TvShow key={index} info={item} />)}
    </section>
  );
};

export default ListItemSection;
