import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    setResults: (state, action: PayloadAction<Result[]>) => {
      state.results = action.payload;
    },
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setResults,
  toggleSelectedItem,
  unselectAllItems,
  setLoading,
  setError,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
