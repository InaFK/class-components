import React from 'react';
import './ResultList.css';
import { useDispatch } from 'react-redux';
import { setSelectedItem } from '../../reducers/pokemonSlice';

interface Result {
  name: string;
  description: string;
}

interface Props {
  results: Result[];
}

const ResultList: React.FC<Props> = ({ results }) => {
  const dispatch = useDispatch();

  const handleSelect = (result: Result) => {
    dispatch(setSelectedItem(result));
  };

  return (
    <div className="result-container">
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <input type="checkbox" onChange={() => handleSelect(result)} />
          <div>
            <h3>{result.name}</h3>
            <p>{result.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultList;
