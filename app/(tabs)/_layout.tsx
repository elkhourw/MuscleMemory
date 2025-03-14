import { NativeBaseProvider, extendTheme } from 'native-base';
import { Tabs } from 'expo-router';
import { ExerciseProvider } from '../Context/ExerciseContext';
import { Ionicons } from '@expo/vector-icons';

// Personnalisation du thème
const theme = extendTheme({
    colors: {
        primary: {
            500: '#6200DD', // Couleur principale
        },
    },
    fonts: {
        heading: 'Roboto-Bold',
        body: 'Roboto-Regular',
    },
});

export default function RootLayout() {
    return (
        <NativeBaseProvider theme={theme}>
            <ExerciseProvider>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: 'blue', // Couleur active
                        tabBarInactiveTintColor: 'gray', // Couleur inactive
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Accueil',
                            tabBarLabel: 'Accueil',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="home" size={size} color={color} />
                            ),
                            headerShown: false,
                        }}
                    />
                    <Tabs.Screen
                        name="exercise"
                        options={{
                            title: 'Exercices',
                            tabBarLabel: 'Exercices',
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="barbell" size={size} color={color} />
                            ),
                            headerShown: false,
                        }}
                    />
                </Tabs>
            </ExerciseProvider>
        </NativeBaseProvider>
    );
}