import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import CardItem from './CardItem';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { spacing } from '../../../theme/spacing';

export default function CardList({ cards, onEdit, onDelete }) {
    useEffect(() => {
        console.log("CardList received cards:", cards);
    }, [cards]);

    if (!cards || cards.length === 0) {
        console.log("No cards found!");
        return <Text style={styles.emptyText}>No cards found</Text>;
    }

    return (
            <FlatList
                data={cards}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // Ensure unique key
                renderItem={({ item }) => (
                    <CardItem card={item} onEdit={onEdit} onDelete={onDelete} />
                )}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
            />
    );
}

const styles = StyleSheet.create({
    flatListContent: {
        paddingBottom: spacing[2],
        paddingTop: spacing[1],
        width:wp(95)

    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: "gray",
        marginTop: 20,
    },
});