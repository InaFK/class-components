import React, { useState } from 'react';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import pokeApiLogo from '../public/assets/pokeapi_256.3fa72200.png';
import Search from '../src/components/Search/Search';
import ResultList from '../src/components/ResultList/ResultList';
import Pagination from '../src/components/Pagination/Pagination';
import Flyout from '../src/components/Flyout/Flyout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPokemons } from '../src/services/pokemonApi';
import { useTheme } from '../src/hooks/useTheme';
import { RootState } from '../src/reducers';
import { unselectAllItems } from '../src/reducers/pokemonSlice';
import { useRouter } from 'next/router';

type Pokemon = {
  name: string;
  description: string;
};

type HomePageProps = {
  pokemons: Pokemon[];
};

const HomePage: React.FC<HomePageProps> = ({ pokemons }) => {
  const { theme, setTheme } = useTheme();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredResults, setFilteredResults] = useState<Pokemon[]>(pokemons);
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.pokemon.selectedItems
  );

  const router = useRouter();
  const page = parseInt((router.query.page as string) || '1', 10);

  const handleSearch = async (term: string) => {
    if (term) {
      const lowerCaseTerm = term.toLowerCase();
      const results = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(lowerCaseTerm)
      );
      setFilteredResults(results);
      if (results.length === 0) {
        setErrorMessage('No results found for the given term');
      } else {
        setErrorMessage(null);
      }
    } else {
      setFilteredResults(pokemons);
      setErrorMessage(null);
    }
  };

  const goToPage = (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
        {errorMessage && (
          <>
            <p>{errorMessage}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </>
        )}
        {!errorMessage && (
          <>
            <ResultList results={filteredResults} />
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

// Static generation
export const getStaticProps: GetStaticProps = async () => {
  const limit = 10;
  const pokemons = await fetchPokemons({ limit, offset: 0 });

  return {
    props: {
      pokemons: pokemons.results.map((item: { name: string; url: string }) => ({
        name: item.name,
        description: item.url,
      })),
    },
  };
};

export default HomePage;
