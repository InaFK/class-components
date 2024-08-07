import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pokemonApi } from '../services/pokemonApi';

interface Result {
  name: string;
  description: string;
}

interface PokemonState {
  results: Result[];
  isLoading: boolean;
  error: string | null;
  selectedItems: Result[];
}

const initialState: PokemonState = {
  results: [],
  isLoading: false,
  error: null,
  selectedItems: [],
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    toggleSelectedItem: (state, action: PayloadAction<Result>) => {
      const item = action.payload;
      const index = state.selectedItems.findIndex((i) => i.name === item.name);
      if (index >= 0) {
        state.selectedItems.splice(index, 1);
      } else {
        state.selectedItems.push(item);
      }
    },
    unselectAllItems: (state) => {
      state.selectedItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(pokemonApi.endpoints.getPokemons.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        pokemonApi.endpoints.getPokemons.matchFulfilled,
        (state, { payload }) => {
          state.results = payload.results.map(
            (item: { name: string; url: string }) => ({
              name: item.name,
              description: item.url,
            })
          );
          state.isLoading = false;
        }
      )
      .addMatcher(
        pokemonApi.endpoints.getPokemons.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error.message || 'Something went wrong';
        }
      );
  },
});

export const { toggleSelectedItem, unselectAllItems } = pokemonSlice.actions;

export default pokemonSlice.reducer;
