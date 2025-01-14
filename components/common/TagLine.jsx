import { Text, StyleSheet, View } from 'react-native'
import colors from '../../theme/color'
import { typography } from '../../theme/typography'
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

export default function TagLine() {
    return (
        <View style={styles.tagLineContainer}>
            <Text style={styles.mainTitle}>PowerVocab</Text>
            <Text style={styles.subtitle}>Virtual Lab Bahasa Inggris</Text>
            <View></View>
            <Text style={styles.tagline}>"Build Your English Word Power"</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    tagLineContainer: {
        alignItems: 'center',
        marginTop: hp(5),
    },
    mainTitle: {
        fontSize: typography.sizes["4xl"],
        fontFamily: typography.fonts.bold,
        fontWeight: typography.weights.bold,
        color: colors.primary[600],
        marginBottom: 8,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: typography.sizes.lg,
        fontFamily: typography.fonts.medium,
        fontWeight: typography.weights.medium,
        color: colors.gray[700],
        textAlign: 'center',
        marginBottom: 4
    },
    tagline: {
        fontSize: typography.sizes.base,
        fontFamily: typography.fonts.medium,
        fontWeight: typography.weights.medium,
        color: colors.primary[500],
        textAlign: 'center'
    }
})