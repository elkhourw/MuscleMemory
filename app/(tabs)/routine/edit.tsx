import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  ButtonText,
  ButtonIcon,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  Text,
  useToast,
  ScrollView,
  HStack,
  AddIcon,
  Icon,
  TrashIcon,
  FlatList,
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@gluestack-ui/themed';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { RoutineContext } from '../../Context/RoutineContext';
import { ExerciseContext } from '../../Context/ExerciseContext';
import { CustomHeader } from '../../Components/CustomHeader';

export default function EditRoutineScreen() {
  const navigation = useNavigation();
  const { routineId } = useLocalSearchParams(); // Récupérer l'ID de la routine depuis les paramètres
  const { exercises } = useContext(ExerciseContext);
  const { getRoutine, updateRoutine } = useContext(RoutineContext);
  const toast = useToast();

  const [routineName, setRoutineName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});

  // Gestion des Actionsheets
  const [isExerciseActionsheetOpen, setIsExerciseActionsheetOpen] = useState(false);

  const openExerciseActionsheet = () => setIsExerciseActionsheetOpen(true);
  const closeExerciseActionsheet = () => setIsExerciseActionsheetOpen(false);

  useEffect(() => {
    const loadRoutine = async () => {
      if (routineId) {
        try {
          const routine = await getRoutine(routineId); // Attendre que la promesse soit résolue

          if (routine && routine.exercises) {
            setRoutineName(routine.name);
            setSelectedExercises(routine.exercises);
          } else {
            console.error("Routine non trouvée ou données incomplètes");
          }
        } catch (error) {
          console.error("Erreur lors du chargement de la routine :", error);
        }
      }
    };

    loadRoutine(); // Appeler la fonction asynchrone
  }, [routineId, getRoutine]);

  // Récupérer le nom de l'exercice à partir de son ID
  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise ? exercise.name : 'Exercice inconnu';
  };

  // Valider le formulaire
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!routineName.trim()) {
      newErrors.routineName = 'Le nom de la routine est requis.';
    }

    if (selectedExercises.length === 0) {
      newErrors.selectedExercises = 'Veuillez sélectionner au moins un exercice.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [routineName, selectedExercises]);

  // Soumettre le formulaire
  const handleUpdateRoutine = useCallback(() => {
    if (validateForm()) {
      const routineData = {
        id: routineId,
        name: routineName,
        exercises: selectedExercises,
      };

      // Mettre à jour la routine existante
      updateRoutine(routineData);
      toast.show({
        description: 'Routine mise à jour avec succès.',
        status: 'success',
        placement: 'top',
      });

      navigation.goBack();
    } else {
      toast.show({
        description: 'Veuillez corriger les erreurs avant de soumettre.',
        status: 'error',
        placement: 'top',
      });
    }
  }, [routineId, routineName, selectedExercises, validateForm, updateRoutine, toast, navigation]);

  // Ajouter un exercice à la routine
  const handleAddExercise = (exercise) => {
    const isAlreadySelected = selectedExercises.some((e) => e.exerciseId === exercise.id);

    if (isAlreadySelected) {
      toast.show({
        description: 'Cet exercice est déjà ajouté.',
        status: 'warning',
        placement: 'top',
      });
      return;
    }

    const newExercise = {
      exerciseId: exercise.id,
      sets: [],
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    closeExerciseActionsheet(); // Fermer l'Actionsheet après avoir ajouté l'exercice
    setSearchQuery('');
  };

  // Ajouter une série à un exercice
  const addSet = (exerciseId) => {
    const newSet = { weight: '', reps: '', rir: '' };
    const updatedExercises = selectedExercises.map((exercise) =>
      exercise.exerciseId === exerciseId
        ? { ...exercise, sets: [...exercise.sets, newSet] }
        : exercise
    );
    setSelectedExercises(updatedExercises);
  };

  // Mettre à jour une série (poids, répétitions ou RIR)
  const updateSet = (exerciseId, setIndex, field, value) => {
    if (/^\d*$/.test(value)) {
      const updatedExercises = selectedExercises.map((exercise) =>
        exercise.exerciseId === exerciseId
          ? {
            ...exercise,
            sets: exercise.sets.map((set, i) =>
              i === setIndex ? { ...set, [field]: value } : set
            ),
          }
          : exercise
      );
      setSelectedExercises(updatedExercises);
    }
  };

  // Supprimer une série
  const deleteSet = (exerciseId, setIndex) => {
    const updatedExercises = selectedExercises.map((exercise) =>
      exercise.exerciseId === exerciseId
        ? {
          ...exercise,
          sets: exercise.sets.filter((_, i) => i !== setIndex),
        }
        : exercise
    );
    setSelectedExercises(updatedExercises);
  };

  // Supprimer un exercice
  const deleteExercise = (exerciseId) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.exerciseId !== exerciseId)
    );
  };

  // Filtrer les exercices en fonction de la recherche
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <CustomHeader
        title={{ text: 'Modifier la routine' }}
        left={{ text: 'Annuler', action: () => navigation.goBack() }}
        right={{ text: 'Mettre à jour', action: handleUpdateRoutine }}
      />

      <Box flex={1} p="$5">
        <ScrollView>
          {/* Champ de saisie pour le nom de la routine */}
          <FormControl isInvalid={!!errors.routineName} mb="$5">
            <Input borderWidth={0}>
              <InputField
                placeholder="Entrez le nom de la routine"
                value={routineName}
                fontSize="$2xl"
                onChangeText={(text) => {
                  setRoutineName(text);
                  setErrors({ ...errors, routineName: '' });
                }}
              />
            </Input>
            {errors.routineName && (
              <FormControlError>
                <FormControlErrorText>{errors.routineName}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Liste des exercices sélectionnés avec leurs séries */}
          {selectedExercises.map((exercise) => {
            const exerciseName = getExerciseName(exercise.exerciseId);
            return (
              <Box key={exercise.exerciseId} mb="$3">
                <HStack justifyContent="space-between" alignItems="center" mb="$2">
                  <Text fontSize="$lg" fontWeight="$bold">
                    {exerciseName}
                  </Text>
                  <Button bgColor='transparent' onPress={() => deleteExercise(exercise.exerciseId, index)}>
                    <Icon as={TrashIcon} color='red' />
                  </Button>
                </HStack>

                {/* Entête du tableau des séries */}
                <HStack space="$2" mb="$2" alignItems="center">
                  <Text width="$8" textAlign="center" fontWeight="$bold">
                    #
                  </Text>
                  <Text flex={2} fontWeight="$bold">
                    Poids
                  </Text>
                  <Text flex={2} fontWeight="$bold">
                    Reps
                  </Text>
                  <Text flex={2} fontWeight="$bold">
                    RIR
                  </Text>
                  <Box width="$8" />
                </HStack>

                {/* Liste des séries */}
                {exercise.sets.map((set, index) => (
                  <HStack key={index} space="$2" mb="$2" alignItems="center">
                    {/* Numéro de la série */}
                    <Text width="$8" textAlign="center">
                      {index + 1}
                    </Text>

                    {/* Poids */}
                    <Input flex={2}>
                      <InputField
                        placeholder="kg"
                        value={set.weight}
                        onChangeText={(text) =>
                          updateSet(exercise.exerciseId, index, 'weight', text)
                        }
                        keyboardType="numeric"
                      />
                    </Input>

                    {/* Répétitions */}
                    <Input flex={2}>
                      <InputField
                        placeholder="Reps"
                        value={set.reps}
                        onChangeText={(text) =>
                          updateSet(exercise.exerciseId, index, 'reps', text)
                        }
                        keyboardType="numeric"
                      />
                    </Input>

                    {/* RIR */}
                    <Input flex={2}>
                      <InputField
                        placeholder="RIR"
                        value={set.rir}
                        onChangeText={(text) =>
                          updateSet(exercise.exerciseId, index, 'rir', text)
                        }
                        keyboardType="numeric"
                      />
                    </Input>

                    {/* Bouton pour supprimer la série */}
                    <Button bgColor='transparent' onPress={() => deleteSet(exercise.exerciseId, index)}>
                      <Icon as={TrashIcon} color='red' />
                    </Button>
                  </HStack>
                ))}

                {/* Bouton pour ajouter une série */}
                <Button
                  onPress={() => addSet(exercise.exerciseId)}
                  variant="outline"
                  borderColor="$primary500"
                  mt="$5"
                >
                  <ButtonIcon as={AddIcon} mr="$2" />
                  <ButtonText color="$primary500">Ajouter une série</ButtonText>
                </Button>
              </Box>
            );
          })}

          {/* Bouton pour ajouter un exercice et message d'erreur */}
          <FormControl isInvalid={!!errors.selectedExercises} mb="$5">
            {/* Bouton pour ajouter une série */}
            <Button onPress={openExerciseActionsheet} mb="$5">
              <ButtonIcon as={AddIcon} mr={5} />
              <ButtonText>Ajouter un exercice</ButtonText>
            </Button>

            {/* Message d'erreur si aucun exercice n'est sélectionné */}
            {errors.selectedExercises && (
              <FormControlError>
                <FormControlErrorText>{errors.selectedExercises}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </ScrollView>

        {/* Actionsheet pour ajouter un exercice */}
        <Actionsheet isOpen={isExerciseActionsheetOpen} onClose={closeExerciseActionsheet}>
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <Text fontSize="$xl" fontWeight="$bold" my="$5">
              Sélectionner un exercice
            </Text>

            {/* Barre de recherche */}
            <Input mb="$3">
              <InputField
                placeholder="Rechercher un exercice..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>

            {/* Liste des exercices filtrés */}
            <FlatList
              width="100%"
              data={filteredExercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ActionsheetItem onPress={() => handleAddExercise(item)}>
                  <Text>{item.name}</Text>
                </ActionsheetItem>
              )}
            />
          </ActionsheetContent>
        </Actionsheet>
      </Box>
    </>
  );
}