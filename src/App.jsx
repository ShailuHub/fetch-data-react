import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  async function fetchMovies() {
    setIsLoading(true);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
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

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && <p>No movies found</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
