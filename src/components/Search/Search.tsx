import React, { useState, useEffect } from 'react';
import styles from './Search.module.css';

interface Props {
  onSearch: (term: string) => void;
}

const useSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('searchQuery') || '';
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('searchQuery', searchQuery);
    }
  }, [searchQuery]);

  return [searchQuery, setSearchQuery] as const;
};

const Search: React.FC<Props> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery((e.target as HTMLInputElement).value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className={styles['search-container']}>
      <input
        type="search"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search for a Pokémon..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default Search;
