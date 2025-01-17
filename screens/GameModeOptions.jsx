import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const GameModeOptionsScreen = () => {
    const navigation = useNavigation();

    const games = [
        {
            id: 'BubbleGame',
            title: 'Mandi Gelembung',
            description: 'Letuskan gelembung kosakata untuk mencocokkan kata dengan artinya! Cara yang menyenangkan dan santai untuk belajar.',
            icon: 'water-outline',
            color: '#DBEAFE',
            difficulty: 'Mudah',
            difficultyColor: '#BBF7D0',
        },
        {
            id: 'TranslationGame',
            title: 'Permainan Terjemahan',
            description: 'Uji ingatan Anda dengan mencocokkan pasangan kata! Permainan klasik dengan sentuhan kosakata.',
            icon: 'brain-outline',
            color: '#E9D5FF',
            difficulty: 'Sedang',
            difficultyColor: '#FDE68A',
        },
        {
            id: 'DragDropGame',
            title: 'Seret & Letakkan Kata',
            description: 'Lengkapi cerita menarik dengan mengisi kata-kata yang hilang. Bangun konteks sambil belajar!',
            icon: 'book-outline',
            color: '#DCFCE7',
            difficulty: 'Sulit',
            difficultyColor: '#FECACA',
        }
    ];

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={wp(6)} color="#2563EB" />
                <Text style={styles.backText}>Back to Cards</Text>
            </Pressable>

            <Animated.Text entering={FadeInDown.duration(500)} style={styles.title}>
                Pilih Petualanganmu
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(100).duration(500)} style={styles.subtitle}>
                Temukan mode permainan yang sesuai dengan gaya belajarmu!
            </Animated.Text>

            <ScrollView contentContainerStyle={styles.cardContainer}>
                {games.map((game, index) => (
                    <Animated.View key={game.id} entering={FadeInUp.delay(index * 150).duration(500)}>
                        <Pressable
                            style={[styles.card, { backgroundColor: game.color }]}
                            onPress={() => navigation.navigate(game.id)}
                        >
                            <View style={styles.cardHeader}>
                                <Ionicons name={game.icon} size={wp(8)} color="#333" />
                                <Text style={styles.cardTitle}>{game.title}</Text>
                            </View>
                            <Text style={styles.cardDescription}>{game.description}</Text>

                            <View style={styles.cardFooter}>
                                <View style={[styles.difficultyBadge, { backgroundColor: game.difficultyColor }]}>
                                    <Text style={styles.difficultyText}>{game.difficulty}</Text>
                                </View>
                                <Pressable style={styles.playButton}  onPress={() => navigation.navigate(game.id)}>
                                    <Ionicons name="trophy-outline" size={wp(6)} color="#000" />
                                    <Text style={styles.playButtonText}>Mulai Bermain</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </Animated.View>
                ))}
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
    cardContainer: {
        paddingBottom: hp(6),
    },
    card: {
        borderRadius: wp(4),
        padding: wp(5),
        marginBottom: hp(3),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    cardTitle: {
        fontSize: wp(4.8),
        fontWeight: 'bold',
        marginLeft: wp(3),
        color: '#1F2937',
    },
    cardDescription: {
        fontSize: wp(3.8),
        color: '#374151',
        marginBottom: hp(1.5),
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    difficultyBadge: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.8),
        borderRadius: wp(2),
    },
    difficultyText: {
        fontSize: wp(3.8),
        fontWeight: '600',
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    playButtonText: {
        marginLeft: wp(2),
        fontSize: wp(4),
        fontWeight: '500',
        color: '#1F2937',
    },
});

export default GameModeOptionsScreen;