import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Modal,
    FlatList,
    Alert,
    StyleSheet
} from 'react-native';
import { X, Trash2, AlertCircle } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../../../theme/color';
import { spacing } from '../../../theme/spacing';

export default function AddEditModal({ visible, onClose, initialData }) {
    const [wordInput, setWordInput] = useState({ english: '', indonesian: '' });
    const [wordList, setWordList] = useState([]);
    const [isInputIncomplete, setIsInputIncomplete] = useState(false);

    useEffect(() => {
        if (visible) {
            setWordInput({ english: '', indonesian: '' });
            setWordList(initialData?.words || []);
            setIsInputIncomplete(false);
        }
    }, [visible]);

    const handleInputChange = (field, value) => {
        setWordInput((prev) => ({ ...prev, [field]: value }));

        if ((field === 'english' && value.trim() && !wordInput.indonesian.trim()) ||
            (field === 'indonesian' && value.trim() && !wordInput.english.trim())) {
            setIsInputIncomplete(true);
        } else {
            setIsInputIncomplete(false);
        }
    };

    const handleAddWord = () => {
        if (!wordInput.english.trim() || !wordInput.indonesian.trim()) return;

        setWordList([...wordList, { id: Date.now(), english: wordInput.english, indonesian: wordInput.indonesian }]);
        setWordInput({ english: '', indonesian: '' });
        setIsInputIncomplete(false);
    };

    const handleRemoveWord = (id) => {
        setWordList(wordList.filter((word) => word.id !== id));
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>

                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <X size={wp(5)} color={colors.gray[600]} />
                    </Pressable>

                    <Text style={styles.modalTitle}>Tambah Kata Baru</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Kata Inggris"
                        value={wordInput.english}
                        onChangeText={(text) => handleInputChange('english', text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Kata Indonesia"
                        value={wordInput.indonesian}
                        onChangeText={(text) => handleInputChange('indonesian', text)}
                    />

                    <Pressable
                        style={[styles.addButton, !(wordInput.english.trim() && wordInput.indonesian.trim()) && styles.disabledButton]}
                        onPress={handleAddWord}
                    >
                        <Text style={styles.addButtonText}>+ Tambah Kata</Text>
                    </Pressable>

                    <FlatList
                        data={wordList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.wordItem}>
                                <Text style={styles.wordText}>{item.english}</Text>
                                <Text style={styles.wordText}>{item.indonesian}</Text>
                                <Pressable onPress={() => handleRemoveWord(item.id)}>
                                    <Trash2 size={wp(4)} color={colors.error[600]} />
                                </Pressable>
                            </View>
                        )}
                        style={styles.wordList}
                    />

                    {isInputIncomplete && (
                        <View style={styles.warningBox}>
                            <AlertCircle size={wp(4)} color={colors.warning[600]} style={styles.warningIcon} />
                            <Text style={styles.warningText}>
                                Ada kata yang belum ditambahkan. Klik "Tambah Kata" atau hapus input terlebih dahulu.
                            </Text>
                        </View>
                    )}

                    <Pressable
                        style={[styles.nextButton, wordList.length === 0 && styles.disabledButton]}
                        disabled={wordList.length === 0}
                    >
                        <Text style={styles.nextButtonText}>Lanjut</Text>
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
        height: hp(80),
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
    input: {
        width: "100%",
        padding: spacing[2],
        borderWidth: 1,
        borderColor: colors.gray[400],
        borderRadius: wp(2),
        marginBottom: spacing[2],
    },
    addButton: {
        backgroundColor: colors.primary[500],
        padding: spacing[2],
        borderRadius: wp(2),
        alignItems: "center",
        width: "100%",
    },
    addButtonText: { color: "white", fontWeight: "bold" },
    wordList: {
        width: "100%",
        marginVertical: spacing[2],
    },
    wordItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: spacing[2],
        backgroundColor: colors.primary[200],
        borderRadius: wp(2),
        marginBottom: spacing[1],
    },
    wordText: {
        fontSize: wp(4),
        fontWeight: "500",
        color: colors.primary[700],
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.warning[50],
        padding: spacing[2],
        borderRadius: wp(2),
        marginTop: spacing[0],
    },
    warningIcon: {
        marginRight: spacing[2],
    },
    warningText: {
        color: colors.warning[600],
        fontSize: wp(3.5),
    },
    nextButton: {
        backgroundColor: colors.primary[500],
        padding: spacing[3],
        borderRadius: wp(2),
        alignItems: "center",
        width: "100%",
        marginBottom: spacing[2],
    },
    nextButtonText: { color: "white", fontWeight: "bold" },
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
    },
});