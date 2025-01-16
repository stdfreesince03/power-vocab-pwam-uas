import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Plus } from 'lucide-react-native';
import colors from '../../../theme/color';
import layout from '../../../theme/layout';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function NoCardYet({ onAddCard }) {
    const { width } = useWindowDimensions();

    const dynamicStyles = {
        content: {
            width: width > 600 ? wp('60%') : wp('90%'), // Wider screens get 60%, smaller get 90%
            paddingHorizontal: width > 600 ? spacing[6] : spacing[4],
        },
        button: {
            paddingVertical: width > 600 ? spacing[4] : spacing[3],
            paddingHorizontal: width > 600 ? spacing[6] : spacing[4],
        },
        buttonText: {
            fontSize: width > 600 ? typography.sizes.lg.fontSize : typography.sizes.base.fontSize,
        },
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, dynamicStyles.content]}>
                <Text style={styles.text}>Belum ada kartu pembelajaran</Text>
                <Pressable style={[styles.button, dynamicStyles.button]} onPress={onAddCard}>
                    <Plus color="white" />
                    <Text style={[styles.buttonText, dynamicStyles.buttonText]}>Buat Kartu Pertama</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing[4],
    },
    content: {
        alignItems: 'center',
        borderRadius: layout.borderRadius['2xl'],
        backgroundColor: colors.background_1.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
    },
    text: {
        ...typography.sizes.base,
        color: colors.primary[600],
        marginBottom: spacing[4],
        textAlign: 'center',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: colors.primary[500],
        borderRadius: layout.borderRadius.xl,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        marginLeft: spacing[2],
        fontWeight: 'bold',
    },
});