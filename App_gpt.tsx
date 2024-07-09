import React, { Component } from 'react';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import pokeApiLogo from './assets/pokeapi_256.3fa72200.png';
import Search from './components/Search/Search';
import ResultList from './components/ResultList/ResultList';
import './App.css';

interface State {
  results: { name: string; description: string }[];
  loading: boolean;
}

class App extends Component<Record<string, never>, State> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      results: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchResults(localStorage.getItem('searchTerm') || '');
  }

  fetchResults = async (term: string) => {
    this.setState({ loading: true });
    try {
      const response = await fetch(`
        https://pokeapi.co/api/v2/pokemon?limit=10&offset=0&name=${term}
      `);
      const data = await response.json();
      this.setState({
        results: data.results.map((item: { name: string; description: string }) => ({
          name: item.name,
          description: item.url,
        })),
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching results:', error);
      this.setState({ loading: false });
    }
  };

  handleSearch = (term: string) => {
    this.fetchResults(term);
  };

  throwError = () => {
    throw new Error('Test error');
  };

  render() {
    const { results, loading } = this.state;

    return (
      <ErrorBoundary>
        <main>
          <header>
            <h1 className="top-head">
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                RESTfull api:
              </a>
              <img src={pokeApiLogo} alt="Poke Api" width="200" height="70" />
            </h1>
            <div className="top-head">
              <button onClick={this.throwError}>Throw Error</button>
            </div>
          </header>
          <section>
            <Search onSearch={this.handleSearch} />
          </section>
          <section>
            {loading ? <p>Loading...</p> : <ResultList results={results} />}
          </section>
        </main>
      </ErrorBoundary>
    );
  }
}

export default App;
