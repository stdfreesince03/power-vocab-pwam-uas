import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Book, Calendar, ChevronRight, Edit2, Trash2 } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../../../theme/color';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import useCardStore from "../../../store/cardStore";
import {useNavigation} from "@react-navigation/native";

export default function CardItem({ card, onEdit, onDelete }) {

    const {setChosenCard} = useCardStore();
    const navigation = useNavigation();

    const getProgressColor = (progress) => {
        if(progress === 0 ) return "transparent"
        if (progress < 30) return colors.error[400];
        if (progress < 70) return colors.warning[400];
        if (progress === 100) return colors.success["400"]
        return colors.success[400];
    };

    function handleCardItemDelete(){
        setChosenCard(card);
        onDelete();
    }

    function toCardDetail(){
        setChosenCard(card);
        navigation.navigate('CardDetailScreen')
    }

    function handleCardItemEdit(){
        setChosenCard(card);
        onEdit();
    }

    return (
        <Pressable style={styles.cardContainer}>
            <View style={styles.header}>
                <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                    {card.title}
                </Text>
                <View style={styles.iconContainer}>
                    <Pressable onPress={() => handleCardItemEdit()} style={styles.editIcon}>
                        <Edit2 size={wp(4)} color={colors.primary[500]} />
                    </Pressable>
                    <Pressable onPress={() => handleCardItemDelete()} style={styles.deleteIcon}>
                        <Trash2 size={wp(4)} color={colors.error[600]} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressLabel}>
                    <Text style={styles.progressText}>Progress</Text>
                    <Text style={styles.progressText}>{card.progress}%</Text>
                </View>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${Math.max(card.progress, 2)}%`,
                                backgroundColor: getProgressColor(card.progress)
                            },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Book size={wp(3.5)} color={colors.primary[400]} />
                    <Text style={styles.infoText}>{card.totalWords} kata</Text>
                </View>
                <View style={styles.infoItem}>
                    <Calendar size={wp(3.5)} color={colors.primary[400]} />
                    <Text style={styles.infoText}>{card.targetDays} hari</Text>
                </View>
            </View>

            <Pressable style={styles.startButton} onPress={toCardDetail} >
                <Text style={styles.startButtonText}>Mulai Belajar</Text>
                <ChevronRight size={wp(4)} color={colors.primary[500]} />
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.background_1.white,
        borderRadius: wp(2),
        padding: spacing[3],
        marginTop: spacing[4],
        marginLeft:wp(5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '90%',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[2],
    },
    cardTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.primary[700],
        textAlign: 'center',
        flex: 1,
        marginLeft: wp(12),
    },
    iconContainer: {
        flexDirection: 'row',
        gap: wp(1.5),
    },
    editIcon: {
        padding: spacing[2],
        backgroundColor: colors.primary[50],
        borderRadius: wp(1.5),
    },
    deleteIcon: {
        padding: spacing[2],
        backgroundColor: colors.error[50],
        borderRadius: wp(1.5),
    },
    progressContainer: {
        marginBottom: spacing[0],
    },
    progressLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing[1],
    },
    progressText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.primary[600],
    },
    progressBar: {
        height: hp(1.2),
        backgroundColor: colors.primary[200],
        borderRadius: wp(1),
        overflow: 'hidden',
        marginBottom: spacing[3],
    },
    progressFill: {
        height: '100%',
        borderRadius: wp(1),
        minWidth: wp(2),
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 0,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.48,
        gap: spacing[1],
        backgroundColor: colors.primary[200],
        paddingVertical: spacing[1],
        paddingHorizontal: spacing[2],
        borderRadius: wp(1.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    infoText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
        color: colors.primary[600],
    },
    startButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[3],
        borderRadius: wp(1.5),
        marginTop: spacing[2],
    },
    startButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.primary[500],
    },
});

