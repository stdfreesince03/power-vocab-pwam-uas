import { StatusBar } from 'expo-status-bar';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from "./screens/AuthScreen";
import LearningCardScreen from "./screens/LearningCardScreen";
import Toast from "react-native-toast-message";
import useAuthStore from "./store/authStore";
import {useEffect, useState} from "react";
import CardDetailScreen from "./screens/CardDetailScreen";
import FlashCardMode from "./screens/FlashCardMode";
import GameModeOptionsScreen from "./screens/GameModeOptions";
import BubbleBathGame from "./screens/BubbleBathGame";
import TranslationGame from "./screens/TranslationGame";
import DragDropWordGame from "./screens/DragDropGame";


const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

export default function App() {
    const authStore = useAuthStore();

    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            await authStore.initialize();
            setIsInitializing(false);
        };
        initializeAuth();
    }, []);

    if (isInitializing) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <>
            <NavigationContainer>
                {authStore.isAuthenticated ? (
                    <AppStack.Navigator>
                        <AppStack.Screen
                            name="LearningCardScreen"
                            component={LearningCardScreen}
                            options={{
                                headerBackVisible: false,
                            }}/>
                        <AppStack.Screen name="CardDetailScreen"
                                         component={CardDetailScreen}
                                       options={{
                                           headerShown:false
                                       }}
                        />
                        <AppStack.Screen name="FlashCardMode"
                                         component={FlashCardMode}
                                         options={{
                                             headerShown:false
                                         }}
                        />
                        <AppStack.Screen name="GameModeOptions"
                                         component={GameModeOptionsScreen}
                                         options={{
                                             headerShown:false
                                         }}
                        />
                        <AppStack.Screen name={"BubbleGame"}
                                         component={BubbleBathGame}
                                         options={{
                                             headerShown:false
                                         }}
                        />
                        <AppStack.Screen name={"TranslationGame"}
                                         component={TranslationGame}
                                         options={{
                                             headerShown:false
                                         }}
                        />
                        <AppStack.Screen name={"DragDropGame"}
                                         component={DragDropWordGame}
                                         options={{
                                             headerShown:false
                                         }}
                        />

                    </AppStack.Navigator>
                ) : (
                    <AuthStack.Navigator>
                        <AuthStack.Screen
                            name="AuthScreen"
                            component={AuthScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_left',
                            }}
                        />
                    </AuthStack.Navigator>
                )}
            </NavigationContainer>
            <Toast />
        </>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});