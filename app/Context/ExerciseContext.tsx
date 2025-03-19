//ExerciseContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Importez la configuration Firebase
import { getDocs, collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Exercise } from '../types/interfaces';

export const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const exercisesRef = collection(db, 'exercises');

  // Charger les exercices initialement
  useEffect(() => {
    const loadInitialExercises = async () => {
      try {
        const querySnapshot = await getDocs(exercisesRef);
        const loadedExercises = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExercises(loadedExercises);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement initial des exercices :', error);
        setError('Erreur lors du chargement des exercices. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialExercises();
  }, []);

  // Écouter les changements en temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(
      exercisesRef,
      (querySnapshot) => {
        const loadedExercises = [];
        querySnapshot.forEach((doc) => {
          loadedExercises.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setExercises(loadedExercises);
        setError(null);
      },
      (error) => {
        console.error('Erreur lors de l\'écoute des exercices :', error);
        setError('Erreur lors de la mise à jour des exercices. Veuillez réessayer.');
      }
    );

    return () => unsubscribe();
  }, []);

  // Ajouter un nouvel exercice
  const addExercise = async (exercise: Exercise) => {
    try {
      await addDoc(exercisesRef, exercise)
      // const newExercise = { id: newDocRef.id, ...exercise };
      // setExercises([...exercises, newExercise]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'exercice :', error);
    }
  };

  // Supprimer un exercice
  const deleteExercise = async (id: string) => {
    try {
      const exerciseDoc = doc(exercisesRef, id);
      await deleteDoc(exerciseDoc);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'exercice :', error);
    }
  };

  // Récupérer un exercice par son ID
  const getExercise = (id: string) => {
    return exercises.find((exercise) => exercise.id === id);
  };

  // Mettre à jour un exercice
  const updateExercise = async (exercise: Exercise) => {
    try {
      const exerciseDoc = doc(exercisesRef, exercise.id);
      await updateDoc(exerciseDoc, exercise);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'exercice :', error);
    }
  };

  return (
    <ExerciseContext.Provider
      value={{ exercises, addExercise, deleteExercise, getExercise, updateExercise }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};