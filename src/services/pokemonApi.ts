export const fetchPokemons = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch pokemons');
  }
  return response.json();
};

export const fetchPokemonDetails = async (name: string) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
};
