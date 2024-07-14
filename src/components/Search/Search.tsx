import React, { useState, useEffect } from 'react';
import './Search.css';

interface Props {
  onSearch: (term: string) => void;
}

const useSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return localStorage.getItem('searchQuery') || '';
  });

  useEffect(() => {
    return () => {
      localStorage.setItem('searchQuery', searchQuery);
    };
  }, [searchQuery]);

  return [searchQuery, setSearchQuery] as const;
};

const Search: React.FC<Props> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="search-container">
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
