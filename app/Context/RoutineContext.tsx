import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebaseConfig';
import { getDocs, collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { Routine } from '../types/interfaces';
import { ExerciseContext } from './ExerciseContext'; // Importer le contexte des exercices

export const RoutineContext = createContext();

export const RoutineProvider = ({ children }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const routinesRef = collection(db, 'routines');
  const { exercises } = useContext(ExerciseContext); // Utiliser les exercices du contexte

  // Charger les routines initialement
  useEffect(() => {
    const loadInitialRoutines = async () => {
      try {
        const querySnapshot = await getDocs(routinesRef);
        const loadedRoutines = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoutines(loadedRoutines);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement initial des routines :', error);
        setError('Erreur lors du chargement des routines. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialRoutines();
  }, []);

  // Écouter les changements en temps réel sur les routines
  useEffect(() => {
    const unsubscribe = onSnapshot(
      routinesRef,
      (querySnapshot) => {
        const loadedRoutines = [];
        querySnapshot.forEach((doc) => {
          loadedRoutines.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setRoutines(loadedRoutines);
        setError(null);
      },
      (error) => {
        console.error('Erreur lors de l\'écoute des routines :', error);
        setError('Erreur lors de la mise à jour des routines. Veuillez réessayer.');
      }
    );

    return () => unsubscribe();
  }, []);

  // Ajouter une nouvelle routine
  const addRoutine = async (routine: Routine) => {
    try {
      await addDoc(routinesRef, routine);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la routine :', error);
    }
  };

  // Supprimer une routine
  const deleteRoutine = async (id: string) => {
    try {
      const routineDoc = doc(routinesRef, id);
      await deleteDoc(routineDoc);
    } catch (error) {
      console.error('Erreur lors de la suppression de la routine :', error);
    }
  };

  // Récupérer une routine par son ID avec les exercices complets
  const getRoutine = async (id: string) => {
    const routine = routines.find((routine) => routine.id === id);
    if (routine) {
      const exercisesRef = collection(db, 'exercises');

      // Récupérer les détails de chaque exercice
      const exercisesWithDetails = await Promise.all(
        routine.exercises.map(async (exercise) => {
          const exerciseDoc = await getDoc(doc(exercisesRef, exercise.exerciseId));
          const exerciseData = exerciseDoc.data();

          return {
            exerciseId: exercise.exerciseId, // ID de l'exercice
            sets: exercise.sets, // Séries de l'exercice dans la routine
            exerciseName: exerciseData?.name || 'Exercice inconnu', // Nom de l'exercice
            muscleGroups: exerciseData?.muscleGroups || [], // Groupes musculaires de l'exercice
          };
        })
      );

      // Retourner la routine avec les exercices complets
      return {
        id: routine.id, // ID de la routine
        name: routine.name, // Nom de la routine
        exercises: exercisesWithDetails, // Exercices avec leurs détails
      };
    }
    return null; // Retourner null si la routine n'est pas trouvée
  };

  // Mettre à jour une routine
  const updateRoutine = async (updatedRoutine: Routine) => {
    try {
      const routineDoc = doc(routinesRef, updatedRoutine.id);
      await updateDoc(routineDoc, updatedRoutine);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la routine :', error);
    }
  };

  // Ajouter une série à un exercice dans une routine
  const addSetToExercise = async (routineId, exerciseId, newSet) => {
    try {
      const routine = routines.find((routine) => routine.id === routineId);
      const exercise = routine.exercises.find((exercise) => exercise.exerciseId === exerciseId);
      exercise.sets.push(newSet);

      await updateDoc(doc(routinesRef, routineId), {
        exercises: routine.exercises,
      });

      const updatedRoutines = routines.map((routine) =>
        routine.id === routineId ? { ...routine, exercises: routine.exercises } : routine
      );
      setRoutines(updatedRoutines);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la série :', error);
    }
  };

  // Mettre à jour une série dans un exercice
  const updateSetInExercise = async (routineId, exerciseId, setIndex, updatedSet) => {
    try {
      const routine = routines.find((routine) => routine.id === routineId);
      const exercise = routine.exercises.find((exercise) => exercise.exerciseId === exerciseId);
      exercise.sets[setIndex] = updatedSet;

      await updateDoc(doc(routinesRef, routineId), {
        exercises: routine.exercises,
      });

      const updatedRoutines = routines.map((routine) =>
        routine.id === routineId ? { ...routine, exercises: routine.exercises } : routine
      );
      setRoutines(updatedRoutines);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la série :', error);
    }
  };

  // Supprimer une série d'un exercice
  const deleteSetFromExercise = async (routineId, exerciseId, setIndex) => {
    try {
      const routine = routines.find((routine) => routine.id === routineId);
      const exercise = routine.exercises.find((exercise) => exercise.exerciseId === exerciseId);
      exercise.sets.splice(setIndex, 1);

      await updateDoc(doc(routinesRef, routineId), {
        exercises: routine.exercises,
      });

      const updatedRoutines = routines.map((routine) =>
        routine.id === routineId ? { ...routine, exercises: routine.exercises } : routine
      );
      setRoutines(updatedRoutines);
    } catch (error) {
      console.error('Erreur lors de la suppression de la série :', error);
    }
  };

  return (
    <RoutineContext.Provider
      value={{
        routines,
        addRoutine,
        deleteRoutine,
        getRoutine,
        updateRoutine,
        addSetToExercise,
        updateSetInExercise,
        deleteSetFromExercise,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};