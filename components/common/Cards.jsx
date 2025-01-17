import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Card = ({ style, children }) => (
    <View style={[styles.card, style]}>{children}</View>
);

const CardHeader = ({ style, children }) => (
    <View style={[styles.cardHeader, style]}>{children}</View>
);

const CardTitle = ({ style, children }) => (
    <Text style={[styles.cardTitle, style]}>{children}</Text>
);

const CardDescription = ({ style, children }) => (
    <Text style={[styles.cardDescription, style]}>{children}</Text>
);

const CardContent = ({ style, children }) => (
    <View style={[styles.cardContent, style]}>{children}</View>
);

const CardFooter = ({ style, children }) => (
    <View style={[styles.cardFooter, style]}>{children}</View>
);

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB", // Equivalent to Tailwind 'border-gray-300'
        backgroundColor: "#FFFFFF", // Equivalent to 'bg-card'
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
    },
    cardHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1F2937", // Equivalent to 'text-gray-800'
    },
    cardDescription: {
        fontSize: 14,
        color: "#6B7280", // Equivalent to 'text-muted-foreground'
    },
    cardContent: {
        padding: 16,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };