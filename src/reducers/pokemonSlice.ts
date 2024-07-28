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
  selectedItems: string[];
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
    toggleSelectedItem: (state, action: PayloadAction<string>) => {
      const itemName = action.payload;
      if (state.selectedItems.includes(itemName)) {
        state.selectedItems = state.selectedItems.filter(
          (name) => name !== itemName
        );
      } else {
        state.selectedItems.push(itemName);
      }
    },
    setSelectedItems: (state, action: PayloadAction<string[]>) => {
      state.selectedItems = action.payload;
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

export const { toggleSelectedItem, setSelectedItems } = pokemonSlice.actions;

export default pokemonSlice.reducer;
