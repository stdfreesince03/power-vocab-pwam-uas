import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Plus, LogOut } from 'lucide-react-native';
import colors from '../../../theme/color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Header({ cardsCount = 0, onLogout, onAddCard }) {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Kartu Pembelajaran</Text>
                    <Text style={styles.subtitle}>{cardsCount} kartu tersedia</Text>
                </View>

                <View style={styles.buttonGroup}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.addButton,
                            pressed && styles.buttonPressed
                        ]}
                        android_ripple={{ color: colors.primary[700] }}
                        onPress={onAddCard}
                    >
                        <Plus color="white" size={16} />
                        <Text style={styles.addButtonText}>Tambah</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.logoutButton,
                            pressed && styles.buttonPressed
                        ]}
                        android_ripple={{ color: colors.red[700] }}
                        onPress={onLogout}
                    >
                        <LogOut color="white" size={16} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'ios' ? 44 : 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: wp(5),
        fontWeight: 'bold',
        color: colors.primary[600],
        marginBottom: 2,
    },
    subtitle: {
        fontSize: wp(3.2),
        color: colors.primary[500],
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[500],
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        borderRadius: 8,
        gap: 4,
    },
    buttonPressed: {
        opacity: Platform.OS === 'ios' ? 0.7 : 1,
    },
    addButtonText: {
        color: 'white',
        fontSize: wp(3.2),
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: colors.red[500],
        padding: hp(1),
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});