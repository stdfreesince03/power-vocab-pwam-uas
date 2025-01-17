import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../theme/color';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import useCardStore from '../store/cardStore';

const FlashCardModeScreen = () => {
    const navigation = useNavigation();
    const { chosenCard } = useCardStore();
    const [remainingWords, setRemainingWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (chosenCard?.wordPairs?.length) {
            const shuffledWords = [...chosenCard.wordPairs].sort(() => Math.random() - 0.5);
            setRemainingWords(shuffledWords);
            setCurrentWord(shuffledWords[0]);
        }
    }, [chosenCard]);

    const getProgressColor = (progress) => {
        if (progress === 0) return "transparent";
        if (progress < 30) return "#ef4444";
        if (progress < 70) return "#facc15";
        return "#22c55e";
    };

    const handleNext = (isKnown) => {
        if (isKnown) {
            setRemainingWords((prev) => prev.filter(word => word !== currentWord));
        }

        if (remainingWords.length > 1) {
            const newWords = remainingWords.filter(word => word !== currentWord);
            setCurrentWord(newWords[Math.floor(Math.random() * newWords.length)]);
            setProgress(((chosenCard.wordPairs.length - newWords.length) / chosenCard.wordPairs.length) * 100);
        } else {
            setProgress(100);
            setCurrentWord(null);
        }
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
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={"#0ea5e9"} />
                    <Text style={styles.backText}>Back</Text>
                </Pressable>
                <Text style={styles.wordCounter}>
                    Word {remainingWords.length > 0 ? chosenCard.wordPairs.length - remainingWords.length + 1 :
                    chosenCard.wordPairs.length - remainingWords.length
                } of {chosenCard.wordPairs.length}
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

            {/* Main Content */}
            {currentWord ? (
                <>
                    <Text style={styles.progressText}>
                        Progress: {Math.round(progress)}% ({chosenCard.wordPairs.length - remainingWords.length} of {chosenCard.wordPairs.length} words)
                    </Text>

                    <View style={styles.flashcard}>
                        <Text style={styles.wordText}>{currentWord.english}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable style={[styles.button, styles.knownButton]} onPress={() => handleNext(true)}>
                            <Text style={styles.buttonText}>✔ I Know This</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.learningButton]} onPress={() => handleNext(false)}>
                            <Text style={styles.buttonText}>✖ Still Learning</Text>
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
        backgroundColor: "#ffffff",
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
        marginBottom: hp(3),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: "#0ea5e9",
        fontSize: typography.sizes.md,
        marginLeft: spacing[2],
        fontWeight: 'bold',
    },
    wordCounter: {
        color: "#0ea5e9",
        fontSize: typography.sizes.md,
        fontWeight: 'bold',
    },
    progressContainer: {
        width: '90%',
        height: 6,
        backgroundColor: "#e5e7eb",
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
        color: "#0369a1",
        marginBottom: hp(2),
    },
    flashcard: {
        width: wp(80),
        height: hp(25),
        backgroundColor: "#e0f2fe",
        borderRadius: spacing[4],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#1f2937",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: hp(3),
    },
    wordText: {
        fontSize: typography.sizes["2xl"],
        fontWeight: 'bold',
        color: "#0369a1",
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
        backgroundColor: "#22c55e",
    },
    learningButton: {
        backgroundColor: "#dc2626",
    },
    buttonText: {
        color: 'white',
        fontSize: typography.sizes.lg,
        fontWeight: 'bold',
    },
    completedText: {
        fontSize: typography.sizes.lg,
        color: "#22c55e",
        fontWeight: 'bold',
        marginTop: hp(5),
    },
    noWordsText: {
        fontSize: typography.sizes.lg,
        color: "#6b7280",
        marginTop: hp(20),
    },
});

export default FlashCardModeScreen;