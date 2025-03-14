// createExercise.js
import React, { useState, useContext, useEffect } from 'react';
import { Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Box, Button, FormControl, Input, Select, Text, WarningOutlineIcon, useToast } from 'native-base';
import { useRouter, useNavigation } from 'expo-router'; // Importez useRouter
import { ExerciseContext } from '../../Context/ExerciseContext';
import { Ionicons } from '@expo/vector-icons';

export default function CreateExerciseScreen() {
  const [exerciseName, setExerciseName] = useState('');  
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [errors, setErrors] = useState({});
  const { addExercise } = useContext(ExerciseContext);
  const router = useRouter(); // Initialisez le routeur
  const toast = useToast();

  const navigation = useNavigation();

  const muscleGroups = [
    'Abdominaux',
    'Biceps',
    'Dorsaux',
    'Épaules',
    'Mollets',
    'Pectoraux',
    'Quadriceps',
    'Triceps',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!exerciseName.trim()) {
      newErrors.exerciseName = 'Le nom de l\'exercice est requis.';
    }

    if (!selectedMuscleGroup) {
      newErrors.selectedMuscleGroup = 'Veuillez sélectionner un groupe musculaire.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateExercise = () => {
    if (validateForm()) {
      const newExercise = {
        id: Date.now().toString(), // Génère un ID unique
        name: exerciseName,
        muscleGroup: selectedMuscleGroup,
      };
      addExercise(newExercise); // Ajoute l'exercice à l'état global
      toast.show({
        description: 'Exercice ajouté avec succès.',
        status: 'success',
        placement: "top"
      });
      setExerciseName('');
      setSelectedMuscleGroup('');
      navigation.navigate('index'); // Redirige vers la page d'accueil
    } else {
      toast.show({
        description: 'Veuillez corriger les erreurs avant de soumettre.',
        status: 'danger',
        placement: "top"
      });
    }
  };

  return (
    <Box flex={1} p={5} justifyContent="center">

      <FormControl isInvalid={!!errors.exerciseName} mb={5}>
        <FormControl.Label>Nom de l'exercice</FormControl.Label>
        <Input
          placeholder="Entrez le nom de l'exercice"
          value={exerciseName}
          onChangeText={(text) => {
            setExerciseName(text);
            setErrors({ ...errors, exerciseName: '' });
          }}
        />
        {errors.exerciseName && (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.exerciseName}
          </FormControl.ErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.selectedMuscleGroup} mb={5}>
        <FormControl.Label>Groupe musculaire</FormControl.Label>
        <Select
          selectedValue={selectedMuscleGroup}
          onValueChange={(itemValue) => {
            setSelectedMuscleGroup(itemValue);
            setErrors({ ...errors, selectedMuscleGroup: '' });
          }}
          placeholder="Sélectionnez un groupe musculaire"
          onOpen={() => Keyboard.dismiss()} // Désactive le clavier lors de l'ouverture du Select
        >
          {muscleGroups.map((group, index) => (
            <Select.Item key={index} label={group} value={group} />
          ))}
        </Select>
        {errors.selectedMuscleGroup && (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.selectedMuscleGroup}
          </FormControl.ErrorMessage>
        )}
      </FormControl>

      <Button onPress={handleCreateExercise}>Créer l'exercice</Button>
    </Box>
  );
}