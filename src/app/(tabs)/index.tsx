import { Stack } from 'expo-router';

import { CatalogoScreen } from '../../components/CatalogoScreen';

export default function CatalogoRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Catálogo' }} />
      <CatalogoScreen />
    </>
  );
}
