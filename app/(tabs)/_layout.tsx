import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { ExerciseProvider } from '../Context/ExerciseContext';
import { RoutineProvider } from '../Context/RoutineContext'; // Importer RoutineProvider
import { Ionicons } from '@expo/vector-icons';

import { StyledProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StyledProvider config={config}>
                <ExerciseProvider>
                    <RoutineProvider>
                        <Tabs>
                            <Tabs.Screen
                                name="workout"
                                options={{
                                    title: 'Entrainements',
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="barbell-outline" size={size} color={color} />
                                    ),
                                    headerShown: false,
                                }}
                            />
                            <Tabs.Screen
                                name="routine"
                                options={{
                                    title: 'Routines',
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="list-outline" size={size} color={color} />
                                    ),
                                    headerShown: false,
                                }}
                            />
                            <Tabs.Screen
                                name="exercise"
                                options={{
                                    title: 'Exercices',
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="fitness-outline" size={size} color={color} />
                                    ),
                                    headerShown: false,
                                }}
                            />
                            <Tabs.Screen
                                name="index"
                                options={{
                                    href: null, // Masquer cet écran de la barre d'onglets
                                    headerShown: false,
                                }}
                            />
                        </Tabs>
                    </RoutineProvider>
                </ExerciseProvider>
            </StyledProvider>
        </SafeAreaProvider>
    );
}