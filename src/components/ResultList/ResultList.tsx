import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { toggleSelectedItem } from '../../reducers/pokemonSlice';
import './ResultList.css';

interface Result {
  name: string;
  description: string;
}

interface Props {
  results: Result[];
}

const ResultList: React.FC<Props> = ({ results }) => {
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.pokemon.selectedItems
  );

  const handleSelect = (result: Result) => {
    dispatch(toggleSelectedItem(result));
  };

  return (
    <div className="result-container">
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <input
            type="checkbox"
            checked={selectedItems.some((item) => item.name === result.name)}
            onChange={() => handleSelect(result)}
          />
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
