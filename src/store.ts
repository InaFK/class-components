import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from './services/pokemonApi';
import rootReducer from './reducers';

const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    ...rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type AppDispatch = typeof store.dispatch;

export default store;
