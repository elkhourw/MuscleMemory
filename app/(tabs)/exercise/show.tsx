import { View, Text } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useContext } from 'react';
import { ExerciseContext } from '../../Context/ExerciseContext';

export default function ExerciseDetailsScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  
  const { exercises, getExercise } = useContext(ExerciseContext);  
  
  const {name, muscleGroup} = getExercise(id);

//Changer le titre du header dynamiquement
  useEffect(() => {
    navigation.setOptions({
      title: name || 'Détails de l\'exercice', // Titre par défaut si `name` est vide
    });
  }, [name, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 16, color: 'gray' }}>Muscle ciblé: {muscleGroup}</Text>
      <Text style={{ fontSize: 14, color: 'gray' }}>ID: {id}</Text>
    </View>
  );
}