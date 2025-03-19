import React, { useState, useContext, useEffect } from 'react';
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
  Toast,
  ToastTitle,
  ToastDescription,
  ScrollView,
  HStack,
  Icon,
  FlatList,
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  AddIcon,
  TrashIcon,
} from '@gluestack-ui/themed';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { RoutineContext } from '../../Context/RoutineContext';
import { ExerciseContext } from '../../Context/ExerciseContext';
import { CustomHeader } from '../../Components/CustomHeader';

export default function StartRoutineScreen() {
  const navigation = useNavigation();
  const { routineId } = useLocalSearchParams(); // Récupérer l'ID de la routine depuis les paramètres
  const { exercises } = useContext(ExerciseContext);
  const { getRoutine } = useContext(RoutineContext);
  const toast = useToast();

  const [routineName, setRoutineName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [duration, setDuration] = useState(0); // Timer en secondes
  const [isPaused, setIsPaused] = useState(false); // État de pause du timer
  const [startTime, setStartTime] = useState(new Date()); // Heure de début de la routine
  const [showDatePicker, setShowDatePicker] = useState(false); // Afficher le sélecteur de date et d'heure

  // Gestion des Actionsheets
  const [isTimerActionsheetOpen, setIsTimerActionsheetOpen] = useState(false);
  const [isExerciseActionsheetOpen, setIsExerciseActionsheetOpen] = useState(false);

  const openTimerActionsheet = () => setIsTimerActionsheetOpen(true);
  const closeTimerActionsheet = () => setIsTimerActionsheetOpen(false);

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
            setDuration(0);
            setIsPaused(false);
            setStartTime(new Date());
          } else {
            console.error("Routine non trouvée ou données incomplètes");
          }
        } catch (error) {
          console.error("Erreur lors du chargement de la routine :", error);
        }
      }
    };

    loadRoutine(); // Appeler la fonction asynchrone

    // Démarrer le timer
    const interval = setInterval(() => {
      if (!isPaused) {
        setDuration((prev) => prev + 1);
      }
    }, 1000);

    // Nettoyer le timer lors du démontage de l'écran
    return () => {
      clearInterval(interval);
      console.log('Écran démonté, timer nettoyé');
    };
  }, [navigation, routineId, getRoutine, isPaused]);

  // Calculer le volume total
  const totalVolume = selectedExercises.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.reduce((sum, set) => {
        const weight = parseFloat(set.weight) || 0;
        const reps = parseFloat(set.reps) || 0;
        return sum + weight * reps;
      }, 0)
    );
  }, 0);

  // Calculer le nombre total de séries
  const totalSets = selectedExercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const remainingSecondsAfterHours = seconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    const remainingSeconds = remainingSecondsAfterHours % 60;

    let result = '';

    if (hours > 0) {
      result += `${hours}h `;
    }

    if (minutes > 0 || hours > 0) {
      result += `${minutes}min `;
    }

    result += `${remainingSeconds}s`;

    return result.trim();
  };

  // Formater l'heure de début
  const formatStartTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Formater la date de début
  const formatStartDate = (date) => {
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Gérer la pause du timer
  const handlePauseWorkout = () => {
    setIsPaused((prev) => !prev);
    closeTimerActionsheet(); // Fermer l'Actionsheet après avoir cliqué sur le bouton
  };

  // Gérer la modification de la date et de l'heure
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Masquer le sélecteur
    if (selectedDate) {
      setStartTime(selectedDate); // Mettre à jour la date et l'heure
    }
  };

  // Ajouter un exercice à la routine
  const handleAddExercise = (exercise) => {
    const isAlreadySelected = selectedExercises.some((e) => e.exerciseId === exercise.id);    

    if (isAlreadySelected) {
      toast.show({
        id: "1",
        placement: "bottom",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id
          return (
            <Toast nativeID={uniqueToastId} action="error" variant="solid">
              <ToastTitle>Hello!</ToastTitle>
              <ToastDescription>
                This is a customized toast message.
              </ToastDescription>
            </Toast>
          )
        },
      })
      closeExerciseActionsheet()
      return;
    }

    const newExercise = {
      ...exercise,
      sets: [],
    };

    console.log(newExercise);
    
    setSelectedExercises([...selectedExercises, newExercise]);
    closeExerciseActionsheet(); // Fermer l'Actionsheet après avoir ajouté l'exercice
    setSearchQuery('');
  };

  // Ajouter une série à un exercice
  const addSet = (exerciseId) => {
    const newSet = { weight: '', reps: '', rir: '' };
    const updatedExercises = selectedExercises.map((exercise) =>
      exercise.id === exerciseId
        ? { ...exercise, sets: [...exercise.sets, newSet] }
        : exercise
    );
    setSelectedExercises(updatedExercises);
  };

  // Mettre à jour une série (poids, répétitions ou RIR)
  const updateSet = (exerciseId, setIndex, field, value) => {
    if (/^\d*$/.test(value)) {
      const updatedExercises = selectedExercises.map((exercise) =>
        exercise.id === exerciseId
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
      exercise.id === exerciseId
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
      prevExercises.filter((exercise) => exercise.id !== exerciseId)
    );
  };

  // Filtrer les exercices en fonction de la recherche
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <CustomHeader
        title={{ text: 'Entrainement' }}
        left={{ text: 'Abandonner', action: () => navigation.goBack() }}
        right={{ text: 'Terminer', action: () => {} }}
      />
      <Box flex={1} p="$5">
        <ScrollView>
          {/* Ligne avec Durée, Volume et Séries */}
          <HStack justifyContent="space-between" mb="$5">
            <Box alignItems="center" onTouchEnd={openTimerActionsheet}>
              <Text fontSize="$sm" color="$coolGray500">Durée</Text>
              <Text fontSize="$xl" color="$primary500" fontWeight="$bold">{formatDuration(duration)}</Text>
            </Box>
            <Box alignItems="center">
              <Text fontSize="$sm" color="$coolGray500">Volume</Text>
              <Text fontSize="$xl" fontWeight="$bold">{totalVolume} kg</Text>
            </Box>
            <Box alignItems="center">
              <Text fontSize="$sm" color="$coolGray500">Séries</Text>
              <Text fontSize="$xl" fontWeight="$bold">{totalSets}</Text>
            </Box>
          </HStack>

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
          {selectedExercises.map((exercise) => (
            <Box key={exercise.exerciseId} mb="$3">
              <HStack justifyContent="space-between" alignItems="center" mb="$2">
                <Text fontSize="$lg" fontWeight="$bold">
                  {exercise.exerciseName}
                </Text>
                <Button bgColor="transparent" onPress={() => deleteExercise(exercise.id)}>
                  <Icon as={TrashIcon} color="red" />
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
                        updateSet(exercise.id, index, 'weight', text)
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
                        updateSet(exercise.id, index, 'reps', text)
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
                        updateSet(exercise.id, index, 'rir', text)
                      }
                      keyboardType="numeric"
                    />
                  </Input>

                  {/* Bouton pour supprimer la série */}
                  <Button bgColor="transparent" onPress={() => deleteSet(exercise.id, index)}>
                    <Icon as={TrashIcon} color="red" />
                  </Button>
                </HStack>
              ))}

              {/* Bouton pour ajouter une série */}
              <Button
                onPress={() => addSet(exercise.id)}
                variant="outline"
                borderColor="$primary500"
                mt="$5"
              >
                <ButtonIcon as={AddIcon} mr="$2" />
                <ButtonText color="$primary500">Ajouter une série</ButtonText>
              </Button>
            </Box>
          ))}

          {/* Bouton pour ajouter un exercice et message d'erreur */}
          <FormControl isInvalid={!!errors.selectedExercises} mb="$5">
            <Button onPress={openExerciseActionsheet} mb="$5">
              <ButtonIcon as={AddIcon} mr="$2" />
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

        {/* Actionsheet pour le timer */}
        <Actionsheet isOpen={isTimerActionsheetOpen} onClose={closeTimerActionsheet}>
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <Text fontSize="$xl" fontWeight="$bold" mb="$3">
              Durée
            </Text>
            <Text fontSize="$lg" mb="$3">
              Durée écoulée : {formatDuration(duration)}
            </Text>
            <Text fontSize="$lg" mb="$3">
              Heure de début : {formatStartTime(startTime)}
            </Text>
            <Text fontSize="$lg" mb="$5" onTouchEnd={() => setShowDatePicker(true)}>
              Date de début : {formatStartDate(startTime)}
            </Text>
            <Button
              onPress={handlePauseWorkout}
              bg={isPaused ? '$green500' : '$red500'}
              width="full"
            >
              <ButtonText color="white">
                {isPaused ? 'Reprendre l\'entraînement' : 'Mettre en pause l\'entraînement'}
              </ButtonText>
            </Button>
          </ActionsheetContent>
        </Actionsheet>

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