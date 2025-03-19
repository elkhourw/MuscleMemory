import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Écran principal des exercices */}
      <Stack.Screen
        name="index" // Correspond à app/(tabs)/exercises/index.js
        options={{
          title: 'Entrainements',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new" // Correspond à app/(tabs)/exercises/index.js
        options={{
          title: 'Entrainement',
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}