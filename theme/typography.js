import {Platform} from "react-native";

export const typography = {
    fonts: Platform.select({
        ios: {
            regular: 'System',
            medium: 'System-Medium',
            semibold: 'System-Semibold',
            bold: 'System-Bold',
        },
        android: {
            regular: 'Roboto',
            medium: 'Roboto-Medium',
            bold: 'Roboto-Bold',
        },
    }),
    sizes: {
        xs:12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
        '6xl': 60,
        '7xl': 72
    },

    weights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
    }
};