import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../theme/color';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import useCardStore from '../store/cardStore';
import useAuthStore from "../store/authStore";

const FlashCardModeScreen = () => {
    const navigation = useNavigation();
    const { chosenCard, updateCard } = useCardStore();
    const authStore = useAuthStore();
    const [remainingWords, setRemainingWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [progress, setProgress] = useState(0);
    const [learnedWords, setLearnedWords] = useState(new Set());

    useEffect(() => {
        if (chosenCard?.wordPairs?.length) {
            const unlearnedWords = chosenCard.wordPairs.filter(wp => !wp.isLearned);
            setRemainingWords([...unlearnedWords].sort(() => Math.random() - 0.5));
            setCurrentWord(unlearnedWords[0] || null);

            const learnedSet = new Set(
                chosenCard.wordPairs.filter(wp => wp.isLearned)
                    .map(wp => `${wp.english.toLowerCase()}:${wp.indonesian.toLowerCase()}`)
            );
            setLearnedWords(learnedSet);

            const initialProgress = (learnedSet.size / chosenCard.wordPairs.length) * 100;
            setProgress(initialProgress);
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            handleSaveAndExit();
            return true;
        });

        return () => backHandler.remove();
    }, [chosenCard]);

    const getProgressColor = (progress) => {
        if (progress === 0) return "transparent";
        if (progress < 30) return "#ef4444";
        if (progress < 70) return "#facc15";
        return "#22c55e";
    };

    const handleNext = (isKnown) => {
        if (currentWord) {
            setLearnedWords(prev => {
                const updated = new Set(prev);
                if (isKnown) {
                    updated.add(`${currentWord.english.toLowerCase()}:${currentWord.indonesian.toLowerCase()}`);
                }
                return updated;
            });

            setRemainingWords(prevWords => {
                const newWords = prevWords.filter(word => word !== currentWord);
                if (newWords.length > 0) {
                    setCurrentWord(newWords[Math.floor(Math.random() * newWords.length)]);
                    setProgress(((chosenCard.wordPairs.length - newWords.length) / chosenCard.wordPairs.length) * 100);
                } else {
                    setProgress(100);
                    setCurrentWord(null);
                    saveProgress();
                }
                return newWords;
            });
        }
    };

    const saveProgress = async () => {
        if (!chosenCard) return;

        const updatedWordPairs = chosenCard.wordPairs.map(word => ({
            english: word.english,
            indonesian: word.indonesian,
            isLearned: learnedWords.has(`${word.english.toLowerCase()}:${word.indonesian.toLowerCase()}`)
        }));

        const updatedCard = {
            ...chosenCard,
            progress: Math.round((learnedWords.size / chosenCard.wordPairs.length) * 100),
            wordPairs: updatedWordPairs
        };

        console.log("Sending Data to API:", JSON.stringify(updatedCard, null, 2));
        await updateCard(authStore.token, updatedCard);
    };

    const handleSaveAndExit = async () => {
        await saveProgress();
        navigation.goBack();
    };

    if (!chosenCard || !chosenCard.wordPairs?.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.noWordsText}>No words available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={handleSaveAndExit} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.primary[500]} />
                    <Text style={styles.backText}>Back</Text>
                </Pressable>
                <Text style={styles.wordCounter}>
                    Word {chosenCard.wordPairs.length - remainingWords.length} of {chosenCard.wordPairs.length}
                </Text>
            </View>

            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressBar,
                        { width: `${progress}%`, backgroundColor: getProgressColor(progress) }
                    ]}
                />
            </View>

            {currentWord ? (
                <>
                    <Text style={styles.progressText}>
                        Progress: {Math.round(progress)}% ({learnedWords.size} of {chosenCard.wordPairs.length} words)
                    </Text>

                    <View style={styles.flashcard}>
                        <Text style={styles.wordText}>{currentWord.english}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.knownButton]}
                            onPress={() => handleNext(true)}
                        >
                            <Text style={styles.buttonText}>I Know This</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.learningButton]}
                            onPress={() => handleNext(false)}
                        >
                            <Text style={styles.buttonText}>Still Learning</Text>
                        </Pressable>
                    </View>
                </>
            ) : (
                <Text style={styles.completedText}>You've completed all words!</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background_1.white,
        paddingHorizontal: spacing[4],
        paddingTop: hp(7),
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: spacing[3],
        marginBottom: hp(5),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: colors.primary[500],
        fontSize: typography.sizes.md,
        marginLeft: spacing[2],
        fontWeight: 'bold',
    },
    wordCounter: {
        color: colors.primary[500],
        fontSize: typography.sizes.md,
        fontWeight: 'bold',
    },
    progressContainer: {
        width: '90%',
        height: 6,
        backgroundColor: colors.gray[200],
        borderRadius: 3,
        marginBottom: spacing[4],
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: typography.sizes.lg,
        color: colors.primary[700],
        marginBottom: hp(4),
    },
    flashcard: {
        width: wp(80),
        height: hp(25),
        backgroundColor: colors.primary[100],
        borderRadius: spacing[4],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.gray[800],
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: hp(3),
    },
    wordText: {
        fontSize: typography.sizes["2xl"],
        fontWeight: 'bold',
        color: colors.primary[700],
    },
    buttonContainer: {
        width: wp(80),
        marginTop: hp(2),
    },
    button: {
        width: '100%',
        paddingVertical: spacing[3],
        borderRadius: spacing[3],
        alignItems: 'center',
        marginBottom: spacing[3],
    },
    knownButton: {
        backgroundColor: colors.secondary[500],
    },
    learningButton: {
        backgroundColor: colors.error[600],
    },
    buttonText: {
        color: colors.background_1.white,
        fontSize: typography.sizes.lg,
        fontWeight: 'bold',
    },
    completedText: {
        fontSize: typography.sizes.lg,
        color: colors.secondary[500],
        fontWeight: 'bold',
        marginTop: hp(5),
    },
    noWordsText: {
        fontSize: typography.sizes.lg,
        color: colors.gray[500],
        marginTop: hp(20),
    },
});

export default FlashCardModeScreen;