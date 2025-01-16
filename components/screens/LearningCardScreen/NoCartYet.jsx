import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import colors from "../../../theme/color";
import { spacing } from "../../../theme/spacing";

export default function NoCardYet({ onAddCard }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Belum ada kartu pembelajaran</Text>
            <Pressable style={styles.addButton} onPress={onAddCard}>
                <Plus size={wp(4)} color="white" />
                <Text style={styles.addButtonText}>Buat Kartu Pertama</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: spacing[4],
        marginTop:wp(10),
        borderRadius: wp(3),
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    title: {
        fontSize: wp(4),
        fontWeight: "600",
        color: colors.gray[700],
        marginBottom: spacing[3],
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary[500],
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[3],
        borderRadius: wp(2),
        width: "100%",
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: spacing[2],
    },
});