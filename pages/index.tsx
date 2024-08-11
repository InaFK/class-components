import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import pokeApiLogo from '../public/assets/pokeapi_256.3fa72200.png';
import Search from '../src/components/Search/Search';
import ResultList from '../src/components/ResultList/ResultList';
import Pagination from '../src/components/Pagination/Pagination';
import Flyout from '../src/components/Flyout/Flyout';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetPokemonsQuery,
  useGetPokemonDetailsQuery,
} from '../src/services/pokemonApi';
import { useTheme } from '../src/hooks/useTheme';
import { RootState } from '../src/reducers';
import { unselectAllItems } from '../src/reducers/pokemonSlice';
import { useRouter } from 'next/router';

const HomePage: React.FC<{
  setErrorMessage: (msg: string | null) => void;
}> = () => {
  const { theme, setTheme } = useTheme();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.pokemon.selectedItems
  );

  const router = useRouter();
  const page = parseInt((router.query.page as string) || '1', 10);

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

  const handleSearch = (term: string) => {
    setSearchTerm(term.trim() === '' ? null : term);
    setErrorMessage(null);
    router.push('/?page=1');
  };

  const goToPage = (newPage: number) => {
    setSearchTerm(null);
    router.push(`/?page=${newPage}`);
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
    if (errorMessage) {
      setErrorMessage(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (error) {
      setErrorMessage('No results found for the given term');
    }
  }, [error]);

  const handleUnselectAll = () => {
    dispatch(unselectAllItems());
  };

  const handleDownload = () => {
    const csvContent = `data:text/csv;charset=utf-8,${selectedItems
      .map((item) => `${item.name},${item.description}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedItems.length}_items.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
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
          <Image src={pokeApiLogo} alt="Poke Api" width="200" height="70" />
        </h1>
        <div className="top-head">
          <button onClick={() => setErrorMessage('Simulated ErrorBoundary')}>
            Simulate ErrorBoundary
          </button>
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
        {errorMessage && (
          <>
            <p>{errorMessage}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </>
        )}
        {!loading && !errorMessage && (
          <>
            <ResultList results={results} />
            <Pagination currentPage={page} onPageChange={goToPage} />
          </>
        )}
      </section>
      <Flyout
        selectedCount={selectedItems.length}
        onUnselectAll={handleUnselectAll}
        onDownload={handleDownload}
      />
    </main>
  );
};

export default HomePage;
