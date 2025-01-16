import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Modal,
    StyleSheet
} from 'react-native';
import { X } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../../../theme/color';
import { spacing } from '../../../theme/spacing';


export default function DetailCardModal({ visible, onClose, wordPairs, onSuccess, onUpdate, initialData }) {

    const [title, setTitle] = useState(initialData?.title || '');
    const [targetDays, setTargetDays] = useState(initialData?.targetDays?.toString() || '');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setTargetDays(initialData.targetDays?.toString() || '');
        }
    }, [initialData, visible])

    const handleCreateCard = () => {
        if (!title.trim() || !targetDays.trim()) return;
        const newCard = {
            title,
            targetDays: parseInt(targetDays),
            wordPairs: wordPairs.map(pair => ({
                english: pair.english,
                indonesian: pair.indonesian
            }))
        };
        onSuccess(newCard);
        handleClose();
    };

    const handleClose= () =>{
        setTitle('');
        setTargetDays('');
        onClose();
    }

    const handleUpdateCard = () => {
        if (!title.trim() || !targetDays.trim()) return;
        const updatedCard = {
            ...initialData,
            title,
            targetDays: parseInt(targetDays),
            wordPairs: wordPairs.map(pair => ({
                english: pair.english,
                indonesian: pair.indonesian
            }))
        };
        onUpdate(updatedCard);
        handleClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Pressable style={styles.closeButton} onPress={handleClose}>
                        <X size={wp(5)} color={colors.gray[600]} />
                    </Pressable>
                    <Text style={styles.modalTitle}>
                        {initialData ? 'Edit Kartu' : 'Detail Kartu Baru'}
                    </Text>
                    <Text style={styles.label}>Judul Kartu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan judul kartu"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Text style={styles.label}>Target Hari</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan target hari"
                        value={targetDays}
                        onChangeText={setTargetDays}
                        keyboardType="numeric"
                    />
                    <Pressable
                        style={[styles.createButton, (!title.trim() || !targetDays.trim()) && styles.disabledButton]}
                        disabled={!title.trim() || !targetDays.trim()}
                        onPress={initialData ? handleUpdateCard : handleCreateCard}
                    >
                        <Text style={styles.createButtonText}>
                            {initialData ? 'Update Kartu' : 'Buat Kartu'}
                        </Text>
                    </Pressable>
                    <Pressable style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Batal</Text>
                    </Pressable>
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
        width: "85%",
        height: hp(35),
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        top: spacing[2],
        right: spacing[2],
    },
    modalTitle: {
        fontSize: wp(5),
        fontWeight: "bold",
        color: colors.primary[700],
        marginBottom: spacing[3],
    },
    label: {
        width: "100%",
        fontSize: wp(4),
        fontWeight: "bold",
        color: colors.primary[700],
        marginBottom: spacing[1],
    },
    input: {
        width: "100%",
        padding: spacing[2],
        borderWidth: 1,
        borderColor: colors.gray[400],
        borderRadius: wp(2),
        marginBottom: spacing[3],
    },
    createButton: {
        backgroundColor: colors.primary[500],
        padding: spacing[3],
        borderRadius: wp(2),
        alignItems: "center",
        width: "100%",
        marginBottom: spacing[2],
    },
    createButtonText: {
        color: "white",
        fontWeight: "bold"
    },
    disabledButton: {
        backgroundColor: colors.primary[200],
    },
    cancelButton: {
        padding: spacing[3],
        width: "100%",
        alignItems: "center",
    },
    cancelButtonText: {
        color: colors.gray[600],
        fontSize: wp(4),
        fontWeight: "bold",
    },
});