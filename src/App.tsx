import React, { Component } from 'react';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Search from './components/Search/Search';
import ResultList from './components/ResultList/ResultList';

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
    const response = await fetch(`
      https://pokeapi.co/api/v2/pokemon?limit=10&offset=0&name=${term}
    `);
    const data = await response.json();
    this.setState({
      results: data.results.map(
        (item: { name: string; description: string }) => ({
          name: item.name,
          description: item.url,
        })
      ),
      loading: false,
    });
  };

  handleSearch = (term: string) => {
    this.fetchResults(term);
  };

  render() {
    const { results, loading } = this.state;

    return (
      <ErrorBoundary>
        <main>
          <section style={{ flex: '0 1 auto' }}>
            <Search onSearch={this.handleSearch} />
          </section>
          <section style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            {loading ? <p>Loading...</p> : <ResultList results={results} />}
          </section>
        </main>
      </ErrorBoundary>
    );
  }
}

export default App;
