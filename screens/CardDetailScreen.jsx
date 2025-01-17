import React from 'react';
import {
    View,
    Text,
    Pressable,
    FlatList,
    StyleSheet
} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import { ArrowLeft, PlayCircle, Library } from 'lucide-react-native';
import colors from '../theme/color.js';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import useCardStore from "../store/cardStore";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const CardDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const { chosenCard,setChosenCard } = useCardStore();


    function handleGoBack(){
        setChosenCard(null);
        navigation.goBack();
    }

    function toGameModeOptions() {
        navigation.dispatch(
            StackActions.replace("GameModeOptions")
        );
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={() =>handleGoBack()} style={styles.backButton}>
                <ArrowLeft size={22} color={colors.primary[500]} />
                <Text style={styles.backText}>Back to Cards</Text>
            </Pressable>

            <View style={styles.header}>
                <Text style={styles.title}>{chosenCard?.title || "Card Title"}</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>Progress: {chosenCard?.progress || 0}%</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>Target Days: {chosenCard?.targetDays || 0}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>Words: {chosenCard?.totalWords || 0}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable style={[styles.button, styles.flashcardButton]} onPress={() => navigation.navigate('FlashCardMode')}>
                    <PlayCircle size={26} color="white" />
                    <Text style={styles.buttonText}>Flashcard Mode</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.gameButton]} onPress={() => toGameModeOptions()}>
                    <Library size={26} color="white" />
                    <Text style={styles.buttonText}>Game Mode</Text>
                </Pressable>
            </View>

            <FlatList
                ListHeaderComponent={() => (
                    <View style={styles.wordTableHeader}>
                        <Text style={styles.wordHeaderText}>#</Text>
                        <Text style={styles.wordHeaderText}>English</Text>
                        <Text style={styles.wordHeaderText}>Indonesian</Text>
                    </View>
                )}
                data={chosenCard?.wordPairs || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.wordRow}>
                        <Text style={styles.wordCell}>{index + 1}</Text>
                        <Text style={styles.wordCell}>{item.english}</Text>
                        <Text style={styles.wordCell}>{item.indonesian}</Text>
                    </View>
                )}
                contentContainerStyle={styles.wordListContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background_1.white,
        paddingHorizontal: spacing[4],
        paddingTop: hp(7.5),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing[3],
    },
    backText: {
        color: colors.primary[500],
        fontSize: typography.sizes.sm,
        marginLeft: spacing[2],
        fontWeight: 'bold',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing[6],
        marginTop: hp(1),
    },
    title: {
        fontSize: typography.sizes["2xl"],
        fontWeight: 'bold',
        color: colors.primary[700],
        marginBottom: hp(0.8),
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: spacing[3],
    },
    infoRow: {
        flexDirection: 'row',
        gap: spacing[3],
        marginTop: spacing[2],
    },
    infoBox: {
        backgroundColor: colors.primary[50],
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[3],
        borderRadius: 24,
        minWidth: wp(38),
        alignItems: 'center',
    },
    infoText: {
        color: colors.primary[700],
        fontSize: typography.sizes.md,
        fontWeight: "600"
    },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing[3],
        marginBottom: spacing[6],
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing[3],
        borderRadius: spacing[3],
        width: wp(90),
    },
    flashcardButton: {
        backgroundColor: colors.purple[500],
    },
    gameButton: {
        backgroundColor: colors.primary[500],
    },
    buttonText: {
        color: 'white',
        fontSize: typography.sizes.lg, // Slightly smaller
        fontWeight: 'bold',
        marginLeft: spacing[2],
    },
    wordListContainer: {
        paddingBottom: spacing[6],
    },
    wordTableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing[2],
        borderBottomWidth: 2,
        borderBottomColor: colors.gray[400],
        backgroundColor: colors.primary[100],
        borderRadius: spacing[2],
        paddingHorizontal: spacing[3]
    },
    wordHeaderText: {
        fontSize: typography.sizes.md,
        fontWeight: 'bold',
        color: colors.primary[700],
        flex: 1,
        textAlign: 'center',
    },
    wordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[300],
        borderRadius: spacing[2],
        paddingHorizontal: spacing[3]
    },
    wordCell: {
        fontSize: typography.sizes.md, // Slightly smaller
        color: colors.primary[600],
        flex: 1,
        textAlign: 'center',
    },
});

export default CardDetailScreen;