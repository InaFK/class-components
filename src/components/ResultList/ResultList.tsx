import React from 'react';
import './ResultList.css';

interface Result {
  name: string;
  description: string;
}

interface Props {
  results: Result[];
}

const ResultList: React.FC<Props> = ({ results }) => {
  return (
    <div className="result-container">
      {results.map((result, index) => (
        <div key={index}>
          <h3>{result.name}</h3>
          <p>{result.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ResultList;
