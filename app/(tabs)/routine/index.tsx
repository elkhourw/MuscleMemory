import React, { useContext, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import {
  Box,
  Text,
  FlatList,
  VStack,
  HStack,
  Badge,
  Button,
  ButtonText,
  ButtonIcon,
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetIcon,
  useToast,
  EditIcon,
  TrashIcon,
  BadgeText,
  PlayIcon
} from '@gluestack-ui/themed';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RoutineContext } from '../../Context/RoutineContext';
import { ExerciseContext } from '@/app/Context/ExerciseContext';
import { CustomHeader } from '../../Components/CustomHeader';

export default function RoutinesScreen() {
  const navigation = useNavigation();
  const { exercises } = useContext(ExerciseContext);
  const { routines, deleteRoutine } = useContext(RoutineContext);
  const toast = useToast();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise ? exercise.name : 'Exercice inconnu';
  };

  const openMenu = (routine) => {
    setSelectedRoutine(routine);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleDeleteRoutine = (id) => {
    Alert.alert(
      'Supprimer la routine',
      'Êtes-vous sûr de vouloir supprimer cette routine ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteRoutine(id);
            closeMenu();
            toast.show({
              description: 'Routine supprimée avec succès.',
              status: 'success',
              placement: 'top',
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderRoutineCard = ({ item }) => (
    <TouchableOpacity>
      <Box borderWidth={1} borderColor="$coolGray300" borderRadius="$md" p="$3" mb="$3">
        <VStack space="md">
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$lg" fontWeight="$bold">{item.name}</Text>
            <Button
              size="sm"
              variant="link"
              onPress={() => openMenu(item)}
            >
              <ButtonIcon as={Ionicons} name="ellipsis-vertical" size={20} color="gray" />
            </Button>
          </HStack>
          <HStack space="md" flexWrap="wrap">
            {item.exercises.map((exercise) => (
              <Badge key={exercise.exerciseId} borderRadius="$md" p={3} action='info'>
                <BadgeText>{getExerciseName(exercise.exerciseId)}</BadgeText>
              </Badge>
            ))}
          </HStack>
          <Button onPress={() => navigation.navigate('workout', { screen: 'new', params: { routineId: item.id } })}>
            <ButtonIcon as={PlayIcon} mr={5} />
            <ButtonText>Commencer la routine</ButtonText>
          </Button>
        </VStack>
      </Box>
    </TouchableOpacity>
  );

  return (
    <>
      <CustomHeader
        title={{ text: 'Routines' }}
        right={{ icon: 'add', action: () => navigation.navigate('new') }}
      />
      <Box flex={1} p="$5">
        <FlatList
          data={routines}
          renderItem={renderRoutineCard}
          keyExtractor={(item) => item.id}
        />
        <Actionsheet isOpen={isMenuOpen} onClose={closeMenu}>
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <ActionsheetItem onPress={() => { navigation.navigate('edit', { routineId: selectedRoutine?.id }); closeMenu(); }}>
              <ActionsheetIcon className="stroke-background-700" as={EditIcon} />
              <ActionsheetItemText>Modifier</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={() => { handleDeleteRoutine(selectedRoutine?.id); closeMenu(); }}>
              <ActionsheetIcon className="stroke-background-700" as={TrashIcon} />
              <ActionsheetItemText>Supprimer</ActionsheetItemText>
            </ActionsheetItem>
          </ActionsheetContent>
        </Actionsheet>
      </Box>
    </>
  );
}