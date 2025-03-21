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
  BadgeText
} from '@gluestack-ui/themed';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseContext } from '../../Context/ExerciseContext';
import { CustomHeader } from '../../Components/CustomHeader';

export default function ExercicesScreen() {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const toast = useToast();
  const { exercises, deleteExercise } = useContext(ExerciseContext);

  const handleDeleteExercise = (id) => {
    Alert.alert(
      "Supprimer l'exercice",
      "Êtes-vous sûr de vouloir supprimer cet exercice ?",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteExercise(id);
            toast.show({
              description: 'Exercice supprimé avec succès.',
              status: 'success',
              placement: 'top',
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditExercise = (id) => {
    navigation.navigate('edit', { exerciseId : id });
  };

  const openMenu = (exercise) => {
    setSelectedExercise(exercise);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const renderExerciseCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('show', { id: item.id })}>
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
            {item.muscleGroups.map((group, key) => (
              <Badge key={key} borderRadius="$md" p={3} action='info'>
                <BadgeText>{group}</BadgeText>
              </Badge>
            ))}
          </HStack>
        </VStack>
      </Box>
    </TouchableOpacity>
  );

  return (
    <>
      <CustomHeader
        title={{ text: 'Exercices' }}
        right={{ icon: 'add', action: () => navigation.navigate('new') }}
      />
      <Box flex={1} p="$5">
        <FlatList
          data={exercises}
          renderItem={renderExerciseCard}
          keyExtractor={(item) => item.id}
        />
        <Actionsheet isOpen={isOpen} onClose={closeMenu}>
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <ActionsheetItem onPress={() => { handleEditExercise(selectedExercise?.id); closeMenu(); }}>
              <ActionsheetIcon className="stroke-background-700" as={EditIcon} />
              <ActionsheetItemText>Modifier</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={() => { handleDeleteExercise(selectedExercise?.id); closeMenu(); }}>
              <ActionsheetIcon className="stroke-background-700" as={TrashIcon} />
              <ActionsheetItemText>Supprimer</ActionsheetItemText>
            </ActionsheetItem>
          </ActionsheetContent>
        </Actionsheet>
      </Box>
    </>
  );
}