export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
  '*.{ts,tsx}': () => 'tsc --noEmit',
  '*.{astro,md,json}': ['prettier --write'],
};
