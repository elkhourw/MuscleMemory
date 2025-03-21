import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Écran principal des exercices */}
      <Stack.Screen
        name="index" // Correspond à app/(tabs)/exercises/index.js
        options={{
          title: 'Exercices',
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      {/* Écran de création d'exercice */}
      <Stack.Screen
        name="new" // Correspond à app/(tabs)/exercises/new.js
        options={{
          title: 'Créer un exercice',
          headerBackVisible: true, // Afficher le bouton de retour
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="show"
        options={{
          title: 'Détails de l\'exercice',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Modifier l\'exercice',
          headerShown: false,
        }}
      />
    </Stack>
  );
}