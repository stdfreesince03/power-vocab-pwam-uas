import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import ScreenWrapper from "../components/common/ScreenWrapper";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import colors from "../theme/color";
import layout from "../theme/layout";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import TagLine from "../components/common/TagLine";
import { login, signup } from "../service/authService";
import { storeToken } from "../utilities/token";
import Toast from "react-native-toast-message";

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

const registrationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    fullName: yup.string().required("Full name is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);

    const schema = isLogin ? loginSchema : registrationSchema;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        let response = null;

        if (isLogin) {
            response = await login(data);
        } else {
            response = await signup(data);
        }

        if (response.error) {
            Toast.show({
                type: "error",
                text1: response.error,
            });
            return;
        }

        if (isLogin) {
            await storeToken(response.token);
        }

        Toast.show({
            type: "success",
            text1: `User ${isLogin ? "Login" : "Registration"} Successful`,
        });
    };

    return (
        <ScreenWrapper
            gradientColors={[colors.background_1.blue50, colors.background_1.white, colors.background_1.primary50]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <KeyboardAvoidingView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.tagLineContainer}>
                        <TagLine />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.formTitle}>{isLogin ? "Welcome Back" : "Create Account"}</Text>

                        <View style={styles.inputs}>
                            {/* Email */}
                            <Controller
                                name="email"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[styles.textInput, errors.email && styles.errorInput]}
                                        placeholder="Email"
                                        value={value}
                                        onChangeText={onChange}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    />
                                )}
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                            {/* Full Name (only for registration) */}
                            {!isLogin && (
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            style={[styles.textInput, errors.fullName && styles.errorInput]}
                                            placeholder="Full Name"
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                            )}
                            {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

                            {/* Password */}
                            <Controller
                                name="password"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[styles.textInput, errors.password && styles.errorInput]}
                                        placeholder="Password"
                                        secureTextEntry
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                            />
                            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                            {/* Confirm Password (only for registration) */}
                            {!isLogin && (
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            style={[styles.textInput, errors.confirmPassword && styles.errorInput]}
                                            placeholder="Confirm Password"
                                            secureTextEntry
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                            )}
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                            )}
                        </View>

                        {/* Submit Button */}
                        <Pressable
                            style={styles.button}
                            onPress={handleSubmit(onSubmit)}
                            android_ripple={{ color: colors.primary[700], borderless: false }}
                        >
                            <Text style={styles.buttonText}>{isLogin ? "Sign In" : "Create Account"}</Text>
                        </Pressable>

                        {/* Switch Button */}
                        <Pressable onPress={() => setIsLogin(!isLogin)}>
                            <Text style={styles.switchText}>
                                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
    tagLineContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
    },
    form: {
        flex: 0.5,
        backgroundColor: "#ffffff",
        marginHorizontal: wp(5),
        borderRadius: layout.borderRadius["2xl"],
        padding: hp(2.5),
        marginVertical: hp(3),
        justifyContent: "center",
        ...Platform.select({
            ios: layout.shadow.ios.sm,
            android: layout.shadow.android.sm,
        }),
    },
    formTitle: {
        fontSize: hp(2.5),
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: hp(2),
    },
    inputs: {
        marginBottom: hp(2),
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: layout.borderRadius.xl,
        padding: hp(1.5),
        marginBottom: hp(1.5),
        backgroundColor: colors.background_1.white,
    },
    errorInput: {
        borderColor: colors.red[500],
    },
    errorText: {
        fontSize: hp(1.5),
        color: colors.red[500],
        marginBottom: hp(1),
    },
    button: {
        backgroundColor: colors.primary[500],
        padding: hp(1.8),
        borderRadius: layout.borderRadius.xl,
        alignItems: "center",
        marginBottom: hp(1.5),
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: hp(2),
    },
    switchText: {
        textAlign: "center",
        color: colors.primary[600],
        marginTop: hp(1),
    },
});