import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Écran principal des routines */}
      <Stack.Screen
        name="index" // Correspond à app/(tabs)/exercises/index.js
        options={{
          title: 'Routines',
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      {/* Écran de création d'routine */}
      <Stack.Screen
        name="new" // Correspond à app/(tabs)/exercises/new.js
        options={{
          title: 'Créer une routine',
          headerTitleAlign: 'center',
          headerBackVisible: false, // Afficher le bouton de retour
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Modifier la routine',
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
    </Stack>
  );
}