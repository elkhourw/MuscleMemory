// ExerciseContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);

  // Charger les exercices depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('exercises');
        if (savedExercises) {
          setExercises(JSON.parse(savedExercises));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des exercices :', error);
      }
    };

    loadExercises();
  }, []);

  // Sauvegarder les exercices dans AsyncStorage
  const saveExercises = async (exercises) => {
    try {
      await AsyncStorage.setItem('exercises', JSON.stringify(exercises));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des exercices :', error);
    }
  };

  // Ajouter un nouvel exercice
  const addExercise = (exercise) => {
    const newExercises = [...exercises, exercise];
    setExercises(newExercises);
    saveExercises(newExercises); // Sauvegarder dans AsyncStorage
  };

  const deleteExercise = (id) => {
    const newExercises = exercises.filter((exercise) => exercise.id !== id);
    setExercises(newExercises);
    saveExercises(newExercises); // Mettre à jour AsyncStorage
  };

  const getExercise = (id) => {
    return exercises.filter((exercise) => exercise.id == id)[0];
  };
  
  // Ajoutez deleteExercise au contexte
  return (
    <ExerciseContext.Provider value={{ exercises, addExercise, deleteExercise, getExercise }}>
      {children}
    </ExerciseContext.Provider>
  );
};