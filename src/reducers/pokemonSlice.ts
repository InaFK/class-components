import { createSlice } from '@reduxjs/toolkit';
import { pokemonApi } from '../services/pokemonApi';

interface PokemonState {
  results: { name: string; description: string }[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PokemonState = {
  results: [],
  isLoading: false,
  error: null,
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(pokemonApi.endpoints.getPokemons.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(pokemonApi.endpoints.getPokemons.matchFulfilled, (state, { payload }) => {
        state.results = payload.results.map((item: { name: string; url: string }) => ({
          name: item.name,
          description: item.url,
        }));
        state.isLoading = false;
      })
      .addMatcher(pokemonApi.endpoints.getPokemons.matchRejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || 'Something went wrong';
      });
  },
});

export default pokemonSlice.reducer;
