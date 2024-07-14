import React, { useState, useEffect } from 'react';
import pokeApiLogo from './assets/pokeapi_256.3fa72200.png';
import Search from './components/Search/Search';
import ResultList from './components/ResultList/ResultList';
import './App.css';

const App: React.FC = () => {
  const [results, setResults] = useState<
    { name: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [throwError, setThrowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialResults();
  }, []);

  useEffect(() => {
    if (throwError) {
      throw new Error('ErrorBoundary Test error');
    }
  }, [throwError]);

  const fetchInitialResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'
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

  const fetchResults = async (term: string) => {
    if (term.trim() === '') {
      fetchInitialResults();
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
    fetchResults(term);
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
      <section>
        {loading && <p>Loading...</p>}
        {errorMessage && <p>{errorMessage}</p>}
        {!loading && !errorMessage && <ResultList results={results} />}
      </section>
    </main>
  );
};

export default App;
