import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  Input,
  InputField,
  Toast,
  ToastTitle,
  useToast,
  HStack,
  Badge,
  BadgeText,
  ScrollView,
  AlertCircleIcon,
} from '@gluestack-ui/themed';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { ExerciseContext } from '../../Context/ExerciseContext';
import { CustomHeader } from '../../Components/CustomHeader';
import { Exercise } from '../../types/interfaces'; // Importer l'interface Exercise

export default function UpdateExerciseScreen() {
  const { exerciseId } = useLocalSearchParams(); // Récupérer l'EXERCISEID de l'exercice depuis l'URL
  const [exerciseName, setExerciseName] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]); // Typé comme un tableau de string
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Typé comme un objet avec des clés string et des valeurs string
  const { getExercise, updateExercise } = useContext(ExerciseContext);
  const toast = useToast();
  const navigation = useNavigation();


  // Charger les données de la exercise si on est en mode modification
  useEffect(() => {
    if (exerciseId) {
      const exercise = getExercise(exerciseId);
      if (exercise) {
        setExerciseName(exercise.name);
        setSelectedMuscleGroups(exercise.muscleGroups);
      }
    }
  }, [exerciseId, getExercise]);


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

  // Valider le formulaire
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!exerciseName.trim()) {
      newErrors.exerciseName = 'Le nom de l\'exercice est requis.';
    }

    if (selectedMuscleGroups.length === 0) {
      newErrors.selectedMuscleGroups = 'Veuillez sélectionner au moins un groupe musculaire.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Créer un nouvel exercice
  const handleUpdateExercise = () => {
    if (validateForm()) {
      const updatedExercise: Exercise = {
        id: exerciseId,
        name: exerciseName,
        muscleGroups: selectedMuscleGroups,
        // Ajoutez d'autres champs si nécessaire (description, equipment, etc.)
      };

      updateExercise(updatedExercise); // Ajouter l'exercice via le contexte
      toast.show({
        render: () => (
          <Toast action="success" variant="solid">
            <ToastTitle>Exercice mis à jour avec succès.</ToastTitle>
          </Toast>
        ),
      });
      setExerciseName('');
      setSelectedMuscleGroups([]); // Réinitialiser la sélection
      navigation.navigate('index'); // Rediriger vers l'écran principal
    } else {
      toast.show({
        render: () => (
          <Toast action="error" variant="solid">
            <ToastTitle>Veuillez corriger les erreurs avant de soumettre.</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  // Gérer la sélection des groupes musculaires
  const handleMuscleGroupSelection = (group: string) => {
    const isSelected = selectedMuscleGroups.includes(group);
    if (isSelected) {
      // Si déjà sélectionné, on le retire
      setSelectedMuscleGroups(selectedMuscleGroups.filter((item) => item !== group));
    } else {
      // Sinon, on l'ajoute
      setSelectedMuscleGroups([...selectedMuscleGroups, group]);
    }
  };

  return (
    <>
      <CustomHeader
        title={{ text: 'Modifier l\'exercice' }}
        left={{ text: 'Annuler', action: () => navigation.goBack() }}
        right={{ text: 'Mettre à jour', action: handleUpdateExercise }}
      />

      <Box flex={1} p="$5" justifyContent="center">
        <ScrollView>
          {/* Champ pour le nom de l'exercice */}
          <FormControl isInvalid={!!errors.exerciseName} mb="$5">
            <FormControlLabel mb='$2'>
              <FormControlLabelText>Nom de l'exercice</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="ex : Développé couché aux haltères"
                value={exerciseName}
                onChangeText={(text) => {
                  setExerciseName(text);
                  setErrors({ ...errors, exerciseName: '' });
                }}
              />
            </Input>
            {errors.exerciseName && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} size="xs" />
                <FormControlErrorText>{errors.exerciseName}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Sélection des groupes musculaires */}
          <FormControl isInvalid={!!errors.selectedMuscleGroups} mb="$5">
            <FormControlLabel mb='$2'>
              <FormControlLabelText>Groupes musculaires</FormControlLabelText>
            </FormControlLabel>
            <HStack space="sm" flexWrap="wrap">
              {muscleGroups.map((group, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleMuscleGroupSelection(group)}
                >
                  <Badge
                    action={selectedMuscleGroups.includes(group) ? 'info' : 'muted'}
                    borderRadius="$sm"
                    p="$2"
                    mr="$1"
                  >
                    <BadgeText>{group}</BadgeText>
                  </Badge>
                </TouchableOpacity>
              ))}
            </HStack>
            {errors.selectedMuscleGroups && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} size="xs" />
                <FormControlErrorText>{errors.selectedMuscleGroups}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </ScrollView>
      </Box>
    </>
  );
}