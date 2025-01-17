import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useCardStore from '../store/cardStore';

const TranslationGame = () => {
    const navigation = useNavigation();
    const { chosenCard } = useCardStore();

    const [wordPairs, setWordPairs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [gameMode, setGameMode] = useState('en-to-id');
    const [isCorrect, setIsCorrect] = useState(null);
    const [gameComplete, setGameComplete] = useState(false);

    useEffect(() => {
        if (chosenCard?.wordPairs?.length) {
            const shuffledPairs = shuffleArray([...chosenCard.wordPairs]);
            setWordPairs(shuffledPairs);
            generateOptions(0, shuffledPairs, gameMode);
        } else {
            Alert.alert("No words available", "This card has no word pairs.");
            navigation.goBack();
        }
    }, [chosenCard]);

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const generateOptions = (index, pairs, mode) => {
        if (!pairs.length) return;

        const correctPair = pairs[index];
        const otherPairs = pairs.filter((_, i) => i !== index);
        const randomPairs = shuffleArray(otherPairs).slice(0, 3);

        setOptions(shuffleArray([
            { text: mode === 'en-to-id' ? correctPair.indonesian : correctPair.english, isCorrect: true },
            ...randomPairs.map(pair => ({
                text: mode === 'en-to-id' ? pair.indonesian : pair.english,
                isCorrect: false,
            }))
        ]));
    };

    const handleOptionSelect = (option, index) => {
        setSelectedOption(index);
        const correct = option.isCorrect;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentIndex < wordPairs.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setIsCorrect(null);
                generateOptions(currentIndex + 1, wordPairs, gameMode);
            } else {
                setGameComplete(true);
            }
        }, 1200);
    };

    const toggleGameMode = () => {
        const newMode = gameMode === 'en-to-id' ? 'id-to-en' : 'en-to-id';
        setGameMode(newMode);
        generateOptions(currentIndex, wordPairs, newMode);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    const resetGame = () => {
        setCurrentIndex(0);
        setScore(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setGameComplete(false);
        const shuffled = shuffleArray([...wordPairs]);
        setWordPairs(shuffled);
        generateOptions(0, shuffled, gameMode);
    };

    if (!wordPairs.length) return null;

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={wp(6)} color="#2563EB" />
                <Text style={styles.backText}>Back to Cards</Text>
            </Pressable>

            <Animated.Text entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} style={styles.title}>
                Translation Game
            </Animated.Text>

            {!gameComplete ? (
                <View style={styles.gameContainer}>
                    <Text style={styles.score}>Score: {score}/{wordPairs.length}</Text>

                    <View style={styles.wordContainer}>
                        <Text style={styles.word}>
                            {gameMode === 'en-to-id'
                                ? wordPairs[currentIndex]?.english
                                : wordPairs[currentIndex]?.indonesian}
                        </Text>
                    </View>

                    <View style={styles.optionsContainer}>
                        {options.map((option, index) => (
                            <Pressable
                                key={index}
                                onPress={() => handleOptionSelect(option, index)}
                                disabled={selectedOption !== null}
                                style={[
                                    styles.option,
                                    selectedOption === index && (isCorrect
                                        ? styles.correct
                                        : styles.wrong)
                                ]}
                            >
                                <Text style={styles.optionText}>{option.text}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Pressable onPress={toggleGameMode} style={styles.toggleButton}>
                        <Ionicons name="swap-horizontal" size={wp(5)} color="#FFF" />
                        <Text style={styles.toggleButtonText}>
                            {gameMode === 'en-to-id' ? "Switch to English" : "Switch to Indonesian"}
                        </Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.completeContainer}>
                    <Ionicons name="trophy-outline" size={wp(20)} color="#F59E0B" />
                    <Text style={styles.completeText}>Game Complete!</Text>
                    <Text style={styles.finalScore}>Final Score: {score}/{wordPairs.length}</Text>
                    <Pressable onPress={resetGame} style={styles.restartButton}>
                        <Text style={styles.restartText}>Play Again</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingTop: hp(8),
        paddingHorizontal: wp(6),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(3),
    },
    backText: {
        fontSize: wp(4.5),
        color: '#2563EB',
        marginLeft: wp(2),
        fontWeight: '500',
    },
    title: {
        fontSize: wp(6),
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1F2937',
        marginBottom: hp(2),
    },
    gameContainer: {
        alignItems: 'center',
    },
    score: {
        fontSize: wp(4.5),
        fontWeight: '600',
        color: '#2563EB',
        marginBottom: hp(2),
    },
    wordContainer: {
        padding: wp(5),
        backgroundColor: '#DBEAFE',
        borderRadius: wp(4),
        marginBottom: hp(3),
    },
    word: {
        fontSize: wp(5),
        fontWeight: 'bold',
        color: '#1F2937',
    },
    optionsContainer: {
        width: '100%',
    },
    option: {
        padding: wp(4),
        borderRadius: wp(3),
        backgroundColor: '#FFF',
        marginBottom: hp(1.5),
        alignItems: 'center',
    },
    optionText: {
        fontSize: wp(4),
        fontWeight: '500',
    },
    correct: {
        backgroundColor: '#BBF7D0',
    },
    wrong: {
        backgroundColor: '#FECACA',
    },
    toggleButton: {
        flexDirection: 'row',
        backgroundColor: '#2563EB',
        padding: wp(3),
        borderRadius: wp(3),
        alignItems: 'center',
        marginTop: hp(3),
    },
    toggleButtonText: {
        fontSize: wp(4),
        color: '#FFF',
        marginLeft: wp(2),
    },
    completeContainer: {
        alignItems: 'center',
    },
    completeText: {
        fontSize: wp(6),
        fontWeight: 'bold',
        color: '#1F2937',
    },
    finalScore: {
        fontSize: wp(4.5),
        color: '#2563EB',
        marginBottom: hp(3),
    },
    restartButton: {
        backgroundColor: '#2563EB',
        padding: wp(4),
        borderRadius: wp(3),
    },
    restartText: {
        fontSize: wp(4.5),
        color: '#FFF',
    },
});

export default TranslationGame;