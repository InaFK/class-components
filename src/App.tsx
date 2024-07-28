import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import pokeApiLogo from './assets/pokeapi_256.3fa72200.png';
import Search from './components/Search/Search';
import ResultList from './components/ResultList/ResultList';
import Pagination from './components/Pagination/Pagination';
import './App.css';
import {
  useGetPokemonsQuery,
  useGetPokemonDetailsQuery,
} from './services/pokemonApi';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [throwError, setThrowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);

  const limit = 10;
  const offset = (page - 1) * limit;

  const {
    data: pokemonListData,
    error: listError,
    isLoading: listLoading,
  } = useGetPokemonsQuery({ limit, offset });
  const {
    data: searchedPokemonData,
    error: searchError,
    isLoading: searchLoading,
  } = useGetPokemonDetailsQuery(searchTerm, {
    skip: !searchTerm,
  });

  useEffect(() => {
    if (throwError) {
      throw new Error('ErrorBoundary Test error');
    }
  }, [throwError]);

  const handleSearch = (term: string) => {
    setSearchTerm(term.trim() === '' ? null : term);
    setErrorMessage(null);
    navigate('/?page=1');
  };

  const goToPage = (newPage: number) => {
    setSearchTerm(null);
    navigate(`/?page=${newPage}`);
  };

  const triggerError = () => {
    setThrowError(true);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const loading = searchTerm ? searchLoading : listLoading;
  const error = searchTerm ? searchError : listError;
  const results = searchTerm
    ? searchedPokemonData
      ? [
          {
            name: searchedPokemonData.name,
            description: searchedPokemonData.species.url,
          },
        ]
      : []
    : pokemonListData
      ? pokemonListData.results.map((item: { name: string; url: string }) => ({
          name: item.name,
          description: item.url,
        }))
      : [];

  useEffect(() => {
    if (error) {
      setErrorMessage('No results found for the given term');
    }
  }, [error]);

  return (
    <main>
      <header>
        <h1 className="top-head">
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
          >
            RESTful API:
          </a>
          <img src={pokeApiLogo} alt="Poke Api" width="200" height="70" />
        </h1>
        <div className="top-head">
          <button onClick={triggerError}>Throw Error</button>
          <button onClick={toggleTheme}>
            Toggle to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
        </div>
      </header>
      <section>
        <Search onSearch={handleSearch} />
      </section>
      <section className="result">
        {loading && <p>Loading...</p>}
        {errorMessage && <p>{errorMessage}</p>}
        {!loading && !errorMessage && <ResultList results={results} />}
        <Pagination currentPage={page} onPageChange={goToPage} />
      </section>
    </main>
  );
};

export default App;
