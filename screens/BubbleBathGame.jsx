import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useCardStore from '../store/cardStore'; // Zustand store

const BubbleBathGame = () => {
    const navigation = useNavigation();
    const { chosenCard } = useCardStore();

    const [words, setWords] = useState({ left: [], right: [] });
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [selectedWord, setSelectedWord] = useState(null);
    const [incorrectPairs, setIncorrectPairs] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (chosenCard?.wordPairs?.length) {
            initializeGame(chosenCard.wordPairs);
        }
    }, [chosenCard]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const initializeGame = (pairs) => {
        const englishWords = pairs.map((pair, index) => ({
            id: `en-${index}`,
            text: pair.english,
            type: 'english',
            pairId: index,
        }));

        const indonesianWords = pairs.map((pair, index) => ({
            id: `id-${index}`,
            text: pair.indonesian,
            type: 'indonesian',
            pairId: index,
        }));

        setWords({
            left: shuffleArray(englishWords),
            right: shuffleArray(indonesianWords),
        });

        setMatchedPairs([]);
        setIncorrectPairs([]);
        setGameStarted(true);
        setSelectedWord(null);
    };

    const handleWordPress = (word) => {
        if (matchedPairs.includes(word.pairId) || incorrectPairs.includes(word.pairId)) {
            return;
        }

        if (!selectedWord) {
            setSelectedWord(word);
        } else {
            if (selectedWord.id === word.id) {
                setSelectedWord(null);
                return;
            }

            if (selectedWord.pairId === word.pairId && selectedWord.type !== word.type) {
                setMatchedPairs((prev) => [...prev, word.pairId]);
                setIncorrectPairs((prev) => prev.filter((id) => id !== word.pairId));

                if (matchedPairs.length + 1 === chosenCard.wordPairs.length) {
                    Alert.alert('🎉 Congratulations!', 'You have completed the game!');
                }
            } else {
                setIncorrectPairs((prev) => [...new Set([...prev, word.pairId, selectedWord.pairId])]);
                Alert.alert('Try Again', 'Incorrect match, keep going!');
            }
            setSelectedWord(null);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={wp(6)} color="#2563EB" />
                <Text style={styles.backText}>Back to Cards</Text>
            </Pressable>

            <Animated.Text entering={FadeInDown.duration(500)} style={styles.title}>
                Word Matching Game
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(100).duration(500)} style={styles.subtitle}>
                Match the words by selecting pairs.
            </Animated.Text>

            <ScrollView contentContainerStyle={styles.wordContainer}>
                <View style={styles.wordColumn}>
                    {words.left.map((word) => (
                        <Pressable
                            key={word.id}
                            style={[
                                styles.wordBubble,
                                matchedPairs.includes(word.pairId) ? styles.matched : {},
                                incorrectPairs.includes(word.pairId) ? styles.incorrect : {},
                                selectedWord?.id === word.id ? styles.selected : {},
                            ]}
                            onPress={() => handleWordPress(word)}
                        >
                            <Text style={styles.wordText}>{word.text}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.wordColumn}>
                    {words.right.map((word) => (
                        <Pressable
                            key={word.id}
                            style={[
                                styles.wordBubble,
                                matchedPairs.includes(word.pairId) ? styles.matched : {},
                                incorrectPairs.includes(word.pairId) ? styles.incorrect : {},
                                selectedWord?.id === word.id ? styles.selected : {},
                            ]}
                            onPress={() => handleWordPress(word)}
                        >
                            <Text style={styles.wordText}>{word.text}</Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
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
        marginBottom: hp(1.5),
    },
    subtitle: {
        fontSize: wp(4),
        textAlign: 'center',
        color: '#6B7280',
        marginBottom: hp(3),
    },
    wordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingBottom: hp(5),
    },
    wordColumn: {
        width: '45%',
        alignItems: 'center',
    },
    wordBubble: {
        width: wp(40),
        paddingVertical: hp(2),
        backgroundColor: '#FFF',
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: hp(1),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    wordText: {
        fontSize: wp(4.5),
        fontWeight: '500',
        color: '#1F2937',
    },
    matched: {
        backgroundColor: '#BBF7D0',
        borderColor: '#10B981',
        borderWidth: 2,
    },
    incorrect: {
        backgroundColor: '#FECACA',
        borderColor: '#DC2626',
        borderWidth: 2,
    },
    selected: {
        borderWidth: 3,
        borderColor: '#2563EB',
    },
});

export default BubbleBathGame;