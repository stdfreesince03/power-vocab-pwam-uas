import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../../theme/color';
import { spacing } from '../../../theme/spacing';

export default function ConfirmDeleteModal({ visible, onConfirmDelete, onCancel }) {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Hapus Kartu Pembelajaran?</Text>
                    <Text style={styles.modalText}>
                        Tindakan ini tidak dapat dibatalkan. Kartu pembelajaran ini akan dihapus secara permanen.
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirmDelete}>
                            <Text style={styles.confirmButtonText}>Hapus</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>Batal</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        backgroundColor: colors.background_1.white,
        padding: spacing[4],
        borderRadius: wp(3),
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: wp(4),
        fontWeight: "bold",
        color: colors.primary[700],
        marginBottom: spacing[3],
    },
    modalText: {
        fontSize: wp(3),
        color: colors.primary[600],
        textAlign: "center",
        marginBottom: spacing[4],
    },
    buttonContainer: {
        flexDirection: "column",
        width: "100%",
    },
    button: {
        paddingVertical: spacing[1.5], // Reduced button height
        borderRadius: wp(2),
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: spacing[2],
    },
    confirmButton: {
        backgroundColor: colors.error[600],
        paddingVertical:spacing[2]
    },
    confirmButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: wp(3.5),
    },
    cancelButton: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: colors.gray[400],
        paddingVertical:spacing[2]
    },
    cancelButtonText: {
        color: colors.gray[700],
        fontWeight: "600",
        fontSize: wp(3.5),
    },
});