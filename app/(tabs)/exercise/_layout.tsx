import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Écran principal des exercices */}
      <Stack.Screen
        name="index" // Correspond à app/(tabs)/exercises/index.js
        options={{
          title: 'Exercices',
        }}
      />
      {/* Écran de création d'exercice */}
      <Stack.Screen
        name="new" // Correspond à app/(tabs)/exercises/new.js
        options={{
          title: 'Créer un exercice',
          headerBackVisible: true, // Afficher le bouton de retour
        }}
      />
      <Stack.Screen
        name="show"
        options={{
          title: 'Détails de l\'exercice',
        }}
      />
    </Stack>
  );
}