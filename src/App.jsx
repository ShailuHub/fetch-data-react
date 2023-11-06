import React, { useCallback, useEffect, useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

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
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
      }
      const data = await response.json();
      const moviesData = data.results.map((movie) => {
        return {
          title: movie.title,
          releaseDate: movie.release_date,
          openingText: movie.opening_crawl,
        };
      });
      setMovies(moviesData);
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

  useEffect(() => {
    console.log("Clicked");
    fetchMovies();
  }, [fetchMovies]);

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

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
