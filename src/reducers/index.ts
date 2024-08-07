import { combineReducers } from '@reduxjs/toolkit';
import pokemonReducer from './pokemonSlice';
import { pokemonApi } from '../services/pokemonApi';

const rootReducer = combineReducers({
  pokemon: pokemonReducer,
  [pokemonApi.reducerPath]: pokemonApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
