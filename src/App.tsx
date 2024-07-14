import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import pokeApiLogo from './assets/pokeapi_256.3fa72200.png';
import Search from './components/Search/Search';
import ResultList from './components/ResultList/ResultList';
import Pagination from './components/Pagination/Pagination';
import './App.css';

const App: React.FC = () => {
  const [results, setResults] = useState<
    { name: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [throwError, setThrowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const limit = 10;

  useEffect(() => {
    fetchResults(page);
  }, [page]);

  useEffect(() => {
    if (throwError) {
      throw new Error('ErrorBoundary Test error');
    }
  }, [throwError]);

  const fetchResults = async (page: number) => {
    setLoading(true);
    const offset = (page - 1) * limit;
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      setResults(
        data.results.map((item: { name: string; url: string }) => ({
          name: item.name,
          description: item.url,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial results:', error);
      setLoading(false);
    }
  };

  const fetchSearchedResults = async (term: string) => {
    if (term.trim() === '') {
      fetchResults(page);
      return;
    }

    setLoading(true);
    setResults([]);
    setErrorMessage(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults([{ name: data.name, description: data.species.url }]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      setLoading(false);
      setErrorMessage('No results found for the given term');
    }
  };

  const handleSearch = (term: string) => {
    navigate('/?page=1');
    fetchSearchedResults(term);
  };

  const goToPage = (newPage: number) => {
    navigate(`/?page=${newPage}`);
  };

  const triggerError = () => {
    setThrowError(true);
  };

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
