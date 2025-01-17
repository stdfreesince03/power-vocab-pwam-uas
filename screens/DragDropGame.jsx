// DragDropWordGame.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    StyleSheet,
    Dimensions, Platform,
} from 'react-native';
import { ArrowLeft, HelpCircle, RefreshCw } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import colors from '../theme/color';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import layout from '../theme/layout';

const DragDropWordGame = ({ navigation }) => {
    const [inputText, setInputText] = useState('');
    const [puzzleStructure, setPuzzleStructure] = useState([]);
    const [availableWords, setAvailableWords] = useState([]);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [error, setError] = useState('');
    const [showTutorial, setShowTutorial] = useState(false);
    const [activeDropZone, setActiveDropZone] = useState(null);

    const getWordCount = (text) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const createPuzzle = (text) => {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);

        if (words.length < 10) {
            setError('Please enter at least 10 words to start the game.');
            return;
        }

        const eligibleIndices = words
            .map((word, idx) => ({ word, idx }))
            .filter(item => item.word.length > 2)
            .map(item => item.idx);

        const percentageToHide = words.length <= 15 ? 0.3 : 0.4;
        const numWordsToHide = Math.max(3, Math.floor(eligibleIndices.length * percentageToHide));
        const hiddenIndices = new Set();

        while (hiddenIndices.size < numWordsToHide && eligibleIndices.length > 0) {
            const randomIndex = Math.floor(Math.random() * eligibleIndices.length);
            hiddenIndices.add(eligibleIndices[randomIndex]);
            eligibleIndices.splice(randomIndex, 1);
        }

        const structure = words.map((word, idx) => ({
            id: `slot-${idx}`,
            originalWord: word,
            isHidden: hiddenIndices.has(idx),
            currentWord: hiddenIndices.has(idx) ? null : word,
        }));

        const hidden = words
            .filter((_, idx) => hiddenIndices.has(idx))
            .map((word, idx) => ({
                id: `word-${idx}`,
                word,
                isCorrect: null,
            }));

        setPuzzleStructure(structure);
        setAvailableWords(shuffleArray(hidden));
        setGameStarted(true);
        setError('');
    };

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const checkAnswers = () => {
        let correct = 0;
        const newStructure = [...puzzleStructure];
        const newAvailable = [];

        puzzleStructure.forEach((slot, index) => {
            if (slot.isHidden) {
                if (slot.currentWord === slot.originalWord) {
                    correct++;
                    newStructure[index] = { ...slot, isCorrect: true };
                } else if (slot.currentWord) {
                    newStructure[index] = { ...slot, currentWord: null, isCorrect: false };
                    newAvailable.push({
                        id: `word-${Date.now()}-${index}`,
                        word: slot.currentWord,
                        isCorrect: false,
                    });
                }
            }
        });

        setPuzzleStructure(newStructure);
        setAvailableWords([...availableWords, ...newAvailable]);
        setScore(correct);
    };

    const handleDrop = (word, targetId) => {
        // Find the target slot
        const targetSlot = puzzleStructure.find(slot => slot.id === targetId);
        if (!targetSlot || !targetSlot.isHidden) return;

        // Update puzzle structure
        setPuzzleStructure(prev => prev.map(slot => {
            if (slot.id === targetId) {
                // If there's already a word in the target slot, add it back to available words
                if (slot.currentWord) {
                    setAvailableWords(prev => [
                        ...prev,
                        { id: `word-${Date.now()}`, word: slot.currentWord }
                    ]);
                }
                return { ...slot, currentWord: word.word };
            }
            return slot;
        }));

        // Remove the word from available words
        setAvailableWords(prev => prev.filter(w => w.id !== word.id));
    };

    const resetGame = () => {
        setGameStarted(false);
        setPuzzleStructure([]);
        setAvailableWords([]);
        setScore(0);
        setError('');
        setInputText('');
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={24} color={colors.primary[500]} />
                        <Text style={styles.backText}>Back to Cards</Text>
                    </Pressable>
                    <Pressable onPress={() => setShowTutorial(!showTutorial)}>
                        <HelpCircle size={24} color={colors.primary[500]} />
                    </Pressable>
                </View>

                {/* Tutorial */}
                {showTutorial && (
                    <View style={styles.tutorial}>
                        <Text style={styles.tutorialTitle}>How to Play:</Text>
                        <Text style={styles.tutorialText}>
                            1. Enter a text with at least 10 words{'\n'}
                            2. Some words will be removed and shown below{'\n'}
                            3. Drag and drop words back to their correct positions{'\n'}
                            4. Tap "Check Answers" to see your score
                        </Text>
                    </View>
                )}

                {!gameStarted ? (
                    // Game Setup Screen
                    <View style={styles.setupContainer}>
                        <Text style={styles.label}>
                            Enter your text (minimum 10 words):
                        </Text>
                        <TextInput
                            style={styles.input}
                            multiline
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type or paste your text here..."
                            placeholderTextColor={colors.primary[400]}
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <Pressable
                            style={[
                                styles.startButton,
                                getWordCount(inputText) < 10 && styles.buttonDisabled
                            ]}
                            onPress={() => createPuzzle(inputText)}
                            disabled={getWordCount(inputText) < 10}
                        >
                            <Text style={styles.buttonText}>Start Challenge</Text>
                        </Pressable>
                    </View>
                ) : (
                    // Game Play Screen
                    <View style={styles.gameContainer}>
                        {/* Score Section */}
                        <View style={styles.scoreSection}>
                            <Text style={styles.title}>Complete the Text</Text>
                            <Text style={styles.score}>
                                Score: {score}/{puzzleStructure.filter(s => s.isHidden).length}
                            </Text>
                        </View>

                        {/* Puzzle Area */}
                        <View style={styles.puzzleArea}>
                            <View style={styles.sentenceContainer}>
                                {puzzleStructure.map((slot, index) => (
                                    <React.Fragment key={slot.id}>
                                        {index > 0 && <Text style={styles.space}> </Text>}
                                        {slot.isHidden ? (
                                            <View
                                                style={[
                                                    styles.dropZone,
                                                    slot.currentWord && styles.filledDropZone,
                                                    slot.isCorrect === true && styles.correctDropZone,
                                                    slot.isCorrect === false && styles.incorrectDropZone,
                                                    activeDropZone === slot.id && styles.activeDropZone
                                                ]}
                                                onLayout={event => {
                                                    // Store drop zone position
                                                }}
                                            >
                                                <Text style={styles.dropZoneText}>
                                                    {slot.currentWord || ''}
                                                </Text>
                                            </View>
                                        ) : (
                                            <Text style={styles.regularWord}>
                                                {slot.originalWord}
                                            </Text>
                                        )}
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>

                        {/* Available Words */}
                        <View style={styles.availableWordsSection}>
                            <Text style={styles.subtitle}>Available Words:</Text>
                            <View style={styles.wordsContainer}>
                                {availableWords.map(word => (
                                    <Animated.View
                                        key={word.id}
                                        style={[
                                            styles.draggableWord,
                                            word.isCorrect === false && styles.incorrectWord
                                        ]}
                                    >
                                        <Text style={styles.wordText}>{word.word}</Text>
                                    </Animated.View>
                                ))}
                            </View>
                        </View>

                        {/* Game Controls */}
                        <View style={styles.controls}>
                            <Pressable
                                style={[styles.button, styles.checkButton]}
                                onPress={checkAnswers}
                            >
                                <Text style={styles.buttonText}>Check Answers</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.resetButton]}
                                onPress={resetGame}
                            >
                                <RefreshCw size={20} color={colors.background_1.white} />
                                <Text style={styles.buttonText}>New Game</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background_1.white,
        paddingTop:hp(5)
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing[4],
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: spacing[2],
        fontSize: typography.sizes.md,
        color: colors.primary[500],
        fontWeight: typography.weights.bold,
    },
    tutorial: {
        backgroundColor: colors.primary[50],
        margin: spacing[4],
        padding: spacing[4],
        borderRadius: layout.borderRadius.xl,
    },
    tutorialTitle: {
        fontSize: typography.sizes.lg,
        color: colors.primary[700],
        fontWeight: typography.weights.bold,
        marginBottom: spacing[2],
    },
    tutorialText: {
        color: colors.primary[600],
        lineHeight: typography.sizes.xl,
    },
    setupContainer: {
        padding: spacing[4],
    },
    label: {
        fontSize: typography.sizes.lg,
        color: colors.primary[700],
        marginBottom: spacing[2],
    },
    input: {
        height: hp(25),
        backgroundColor: colors.background_1.white,
        borderWidth: 2,
        borderColor: colors.primary[200],
        borderRadius: layout.borderRadius.xl,
        padding: spacing[4],
        color: colors.primary[700],
        textAlignVertical: 'top',
    },
    errorText: {
        color: colors.error[600],
        marginTop: spacing[2],
    },
    gameContainer: {
        padding: spacing[4],
    },
    scoreSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[4],
    },
    title: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.weights.bold,
        color: colors.primary[700],
    },
    score: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.primary[600],
    },
    puzzleArea: {
        backgroundColor: colors.background_1.white,
        borderRadius: layout.borderRadius.xl,
        padding: spacing[4],
        ...Platform.select({
            ios: layout.shadow.ios.xl,
            android: layout.shadow.android.xl,
        }),
    },
    sentenceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    space: {
        width: spacing[2],
    },
    dropZone: {
        minWidth: 100,
        height: 40,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.primary[300],
        borderRadius: layout.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        margin: spacing[1],
        backgroundColor: colors.background_1.white,
    },
    activeDropZone: {
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[50],
    },
    filledDropZone: {
        borderStyle: 'solid',
        borderColor: colors.primary[400],
    },
    correctDropZone: {
        borderColor: colors.success[500],
        backgroundColor: colors.success[50],
    },
    incorrectDropZone: {
        borderColor: colors.error[400],
        backgroundColor: colors.error[50],
    },
    dropZoneText: {
        color: colors.primary[700],
        fontSize: typography.sizes.md,
    },
    regularWord: {
        color: colors.primary[700],
        fontSize: typography.sizes.lg,
        margin: spacing[1],
    },
    availableWordsSection: {
        marginTop: spacing[6],
    },
    subtitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.semibold,
        color: colors.primary[700],
        marginBottom: spacing[3],
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing[2],
    },
    draggableWord: {
        backgroundColor: colors.primary[100],
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[3],
        borderRadius: layout.borderRadius.lg,
        ...Platform.select({
            ios: layout.shadow.ios.sm,
            android: layout.shadow.android.sm,
        }),
    },
    incorrectWord: {
        backgroundColor: colors.error[100],
    },
    wordText: {
        color: colors.primary[700],
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
    controls: {
        flexDirection: 'row',
        gap: spacing[4],
        marginTop: spacing[6],
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing[3],
        borderRadius: layout.borderRadius.lg,
        gap: spacing[2],
    },
    buttonText: {
        color: colors.background_1.white,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    checkButton: {
        backgroundColor: colors.secondary[500],
    },
    resetButton: {
        backgroundColor: colors.primary[500],
    },
    startButton: {
        backgroundColor: colors.primary[500],
        paddingVertical: spacing[4],
        borderRadius: layout.borderRadius.xl,
        alignItems: 'center',
        marginTop: spacing[4],
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});

export default DragDropWordGame;