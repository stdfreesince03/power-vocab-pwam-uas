import React, { useState, useEffect, useLayoutEffect } from "react";
import {
    Alert,
    BackHandler,
    Text,
    View,
    ActivityIndicator,
    StyleSheet,
    FlatList
} from "react-native";
import { StackActions, useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import useAuthStore from "../store/authStore";
import useCardStore from "../store/cardStore";
import ScreenWrapper from "../components/common/ScreenWrapper";
import colors from "../theme/color";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Header from "../components/screens/LearningCardScreen/Header";
import CardItem from "../components/screens/LearningCardScreen/CardItem";
import AddEditModal from "../components/screens/LearningCardScreen/AddEditModal";
import DetailCardModal from "../components/screens/LearningCardScreen/DetailCardModal";
import NoCardYet from "../components/screens/LearningCardScreen/NoCartYet";
import CardList from "../components/screens/LearningCardScreen/CardList";
import ConfirmDeleteModal from "../components/screens/LearningCardScreen/ConfirmDeleteModal";


export default function LearningCardScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const authStore = useAuthStore();
    const { fetchCards, error, isLoading, cards, addNewCard, setChosenCard ,chosenCard,deleteCard,updateCard} = useCardStore();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalStep, setModalStep] = useState("addEdit");
    const [wordPairs, setWordPairs] = useState([]);

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

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Header cardsCount={cards.length} onAddCard={addCard} onLogout={showLogoutConfirmation} />
            ),
        });
    }, [navigation, cards.length]);

    function addCard() {
        setModalStep("addEdit");
        setModalVisible(true);
    }

    function handleNextStep(words) {
        setWordPairs(words);
        setModalStep("detail");
    }

    async function handleCardSubmit(newCard) {
        await addNewCard(authStore.token, newCard);
        setModalVisible(false);
        setModalStep("addEdit");
    }

    async function handleCardUpdate(newCard){
        await updateCard(authStore.token,newCard)
        setModalVisible(false);
        setModalStep("addEdit");
    }

    async function handleLogout() {
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
    }

    function handleStartDelete(){
        setModalStep('deleteItem');
        setModalVisible(true);
    }

    function closeDeleteModal(){
        setModalVisible(false);
        setChosenCard(null);
    }

    async function handleDelete(){
        if (!chosenCard) {
            return;
        }
        setModalVisible(false);
        await deleteCard(authStore.token,chosenCard.id);
        setChosenCard(null);
    }

    function handleStartEdit(){
        setModalStep("addEdit");
        setModalVisible(true);
    }

    function showLogoutConfirmation() {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", onPress: handleLogout },
            ],
            { cancelable: false }
        );
    }

    return (
        <ScreenWrapper>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                    <Text style={styles.loadingText}>Loading cards...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                </View>
            ) : cards.length > 0 ? (
                <CardList cards={cards} onDelete={handleStartDelete} onEdit={handleStartEdit}></CardList>
            ) : (
                <NoCardYet onAddCard={addCard} />
            )}
            <ConfirmDeleteModal onCancel={() => closeDeleteModal() }
                                onConfirmDelete={handleDelete}
                                visible={modalVisible && modalStep === "deleteItem"}
            ></ConfirmDeleteModal>
            <AddEditModal
                visible={modalVisible && modalStep === "addEdit"}
                onNext={handleNextStep}
                onStartDelete={handleStartDelete}
                initialData={chosenCard}
                onClose={() => closeDeleteModal()}
            />

            <DetailCardModal
                visible={modalVisible && modalStep === "detail"}
                wordPairs={wordPairs}
                token={authStore.token}
                onClose={() => closeDeleteModal()}
                onSuccess={(newCard) => handleCardSubmit(newCard)}
                onUpdate={handleCardUpdate}
                initialData={chosenCard}
            />
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
        marginBottom: hp("20"),
        marginTop: hp("2"),
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
    },
    listContainer: {
        padding: 16,
    },
});