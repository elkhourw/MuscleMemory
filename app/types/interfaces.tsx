//interfaces.ts
import { Timestamp } from 'firebase/firestore';

// Interface pour un exercice
export interface Exercise {
  id?: string; // Optionnel, car il sera généré par Firestore
  name: string;
  muscleGroups: string[];
}

export interface Routine {
  id?: string; // Identifiant unique de la routine (optionnel pour les nouvelles routines)
  name: string; // Nom de la routine
  exercises: {
    exerciseId: string; // Identifiant de l'exercice
    sets: {
      reps: number; // Nombre de répétitions pour cette série
      weight: number; // Poids utilisé pour cette série
      rir: number; // Poids utilisé pour cette série
    }[];
  }[];
}