// index.js (Page d'accueil)
import React, { useContext, useEffect } from 'react';
import { Alert, TouchableOpacity } from 'react-native'; // Importez Alert de React Native
import { Box, Text, Button, FlatList, Card, useToast } from 'native-base';
import { Link, useNavigation } from 'expo-router';
import { ExerciseContext } from '../../Context/ExerciseContext';
import { Ionicons } from '@expo/vector-icons';

export default function ExercicesScreen() {

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: 'Exercices', // Titre du header
      headerRight: () => (
        <Ionicons
          name="add" // Icône "+"
          size={24}
          color="blue"
          onPress={() => navigation.navigate('new')} // Action du bouton
          style={{ marginRight: 15 }}
        />
      ),
    });
  }, [navigation]);

  const toast = useToast();
  
  const { exercises, deleteExercise } = useContext(ExerciseContext);

  const handleDeleteExercise = (id) => {
    Alert.alert(
      'Supprimer l\'exercice',
      'Êtes-vous sûr de vouloir supprimer cet exercice ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteExercise(id);
            toast.show({
              description: 'Exercice supprimé avec succès.',
              status: 'success',
              placement: "top"
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderExerciseCard = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('show', {
          id: item.id,
        })
      }
    >
    <Card style={{ marginBottom: 10, padding: 15 }}>
      <Text fontSize="lg" fontWeight="bold">{item.name}</Text>
      <Text fontSize="sm" color="gray.500">{item.muscleGroup}</Text>
      <Button
        colorScheme="red"
        size="sm"
        mt={2}
        onPress={() => handleDeleteExercise(item.id)}
      >
        Supprimer
      </Button>
    </Card>
    </TouchableOpacity>
  );

  return (
    <Box flex={1} p={5}>

      {/* Liste des exercices */}
      <FlatList
        data={exercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id}
      />
      
    </Box>
  );
}