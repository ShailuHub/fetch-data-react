import React, { useState } from "react";
import classes from "./AddMovieForm.module.css";

const AddMovieForm = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    openingText: "",
    releaseDate: "",
  });
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleOnSubmit = (event) => {
    event.preventDefault();
    props.onAddMovie(formData);
    setFormData((preivousState) => {
      return { ...preivousState, title: "", openingText: "", releaseDate: "" };
    });
  };
  return (
    <React.Fragment>
      <form action="" onSubmit={handleOnSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          name="title"
          onChange={handleOnChange}
        />
        <label htmlFor="text-box">Opening Text</label>
        <textarea
          id="text-box"
          rows={4}
          cols={50}
          value={formData.openingText}
          name="openingText"
          onChange={handleOnChange}
        ></textarea>
        <label htmlFor="release-date">Realese Date</label>
        <input
          type="date"
          id="release-date"
          value={formData.releaseDate}
          name="releaseDate"
          onChange={handleOnChange}
        />
        <button type="submit">Add Movie</button>
      </form>
    </React.Fragment>
  );
};

export default AddMovieForm;
