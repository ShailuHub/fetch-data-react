import React, { useCallback, useEffect, useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovieForm from "./components/AddMovieForm";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(true);
  const [retryTimeout, setRetryTimeout] = useState(null);

  const fetchMovies = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://react-fetch-api-85643-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
      }
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      if (retrying) {
        const timeout = setTimeout(() => {
          fetchMovies();
        }, 5000);
        setRetryTimeout(timeout);
      }
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   fetchMovies();
  // }, [fetchMovies]);

  const handleOnCancel = () => {
    setRetrying(false);
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  };

  let content = <p>No movies found</p>;
  if (!isLoading) {
    if (movies.length === 0 && !error) {
      content = <p>No movies found</p>;
    } else if (movies.length > 0) {
      content = <MoviesList movies={movies} />;
    } else if (error && retrying) {
      content = (
        <div>
          <p>{error}</p>
          <button style={{ backgroundColor: "red" }} onClick={handleOnCancel}>
            Cancel
          </button>
        </div>
      );
    }
  } else {
    content = <p>Loading...</p>;
  }

  const addMovieHandler = async (movie) => {
    try {
      const response = await fetch(
        "https://react-fetch-api-85643-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Add data is rejected by firebase");
      }
      const data = await response.json();
      console.log("Added successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <React.Fragment>
      <section>
        <AddMovieForm onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
