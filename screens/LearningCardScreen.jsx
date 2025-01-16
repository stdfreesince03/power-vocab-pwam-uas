import React, { useEffect } from "react";
import { Alert, BackHandler, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { StackActions, useNavigation, useRoute } from "@react-navigation/native";
import useLayoutEffect from "react-native-web/src/modules/useLayoutEffect";
import Header from "../components/screens/LearningCardScreen/Header";
import Toast from "react-native-toast-message";
import useAuthStore from "../store/authStore";
import useCardStore from "../store/cardStore";
import ScreenWrapper from "../components/common/ScreenWrapper";
import colors from '../theme/color'
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import CardItem from "../components/screens/LearningCardScreen/CardItem";
import CardList from "../components/screens/LearningCardScreen/CardList";

export default function LearningCardScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const authStore = useAuthStore();
    const { fetchCards, error, isLoading, cards } = useCardStore();

    useEffect(() => {
        if (route.params?.auth) {
            Toast.show({
                type: "success",
                text1: `User ${route.params.auth} Successful`,
            });
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            showLogoutConfirmation();
            return true;
        });

        return () => backHandler.remove();
    }, [route.params?.auth]);

    useEffect(() => {
        fetchCards(authStore.token);
    }, [authStore.token]);

    const handleLogout = async () => {
        try {
            await authStore.removeToken();
            navigation.dispatch(StackActions.replace("AuthScreen"));
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Logout failed",
                text2: err.message,
            });
        }
    };

    const showLogoutConfirmation = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", onPress: handleLogout },
            ],
            { cancelable: false }
        );
    };

    function addCard() {

    }

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Header cardsCount={cards.length} onAddCard={addCard} onLogout={showLogoutConfirmation} />
            ),
        });
    }, [navigation, cards.length]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={styles.loadingText}>Loading cards...</Text>
            </View>
        );
    }


    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    function handleCardDelete(){

    }

    function handleCardEdit(){

    }

    return (
        <ScreenWrapper>
            <View style={styles.cardsContainer}>
                {cards.length > 0 ? (
                    <CardList cards={cards} onEdit={handleCardEdit} onDelete={handleCardDelete}></CardList>
                    // cards.map((card) => (
                    //     <CardItem card={card} onDelete={handleCardDelete} onEdit={handleCardDelete} ></CardItem>
                    // ))
                ) : (
                    <Text>No cards available</Text>
                )}
            </View>

        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background_1.white,
    },
    loadingText: {
        marginBottom: hp('20'),
        marginTop:hp('2'),
        fontSize: 18,
        color: colors.primary[500],
        fontWeight: "600",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    }, cardsContainer:{
        textAlign:'center',
        justifyContent:'center',
        alignItems:'center'
    }
});