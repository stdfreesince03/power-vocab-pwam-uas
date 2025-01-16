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
import Toast from "react-native-toast-message";
import { StackActions, useNavigation } from "@react-navigation/native";
import useAuthStore from "../store/authStore";

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

const registrationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    fullName: yup.string().required("Full name is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [focus, setFocused] = useState("");

    const schema = isLogin ? loginSchema : registrationSchema;
    const navigation = useNavigation();
    const authStore = useAuthStore();

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

            if (!response.error) {
                response = await login({ email: data.email, password: data.password });
            }
        }

        if (response.error) {
            Toast.show({
                type: "error",
                text1: response.error,
            });
            return;
        }

        await authStore.setToken(response.token);
        navigation.dispatch(
            StackActions.replace("LearningCardScreen", {
                auth: isLogin ? "Login" : "Registration",
            })
        );
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
                            <Controller
                                name="email"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[
                                            styles.textInput,
                                            errors.email && styles.errorInput,
                                            focus === "email" && styles.focusedInput,
                                        ]}
                                        placeholder="Email"
                                        value={value}
                                        onChangeText={onChange}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused("")}
                                    />
                                )}
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                            {!isLogin && (
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            style={[
                                                styles.textInput,
                                                errors.fullName && styles.errorInput,
                                                focus === "fullName" && styles.focusedInput,
                                            ]}
                                            placeholder="Full Name"
                                            value={value}
                                            onChangeText={onChange}
                                            onFocus={() => setFocused("fullName")}
                                            onBlur={() => setFocused("")}
                                        />
                                    )}
                                />
                            )}
                            {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

                            <Controller
                                name="password"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[
                                            styles.textInput,
                                            errors.password && styles.errorInput,
                                            focus === "password" && styles.focusedInput,
                                        ]}
                                        placeholder="Password"
                                        secureTextEntry
                                        value={value}
                                        onChangeText={onChange}
                                        textContentType="oneTimeCode"
                                        autoComplete="off"
                                        autoCapitalize="none"
                                        onFocus={() => setFocused("password")}
                                        onBlur={() => setFocused("")}
                                    />
                                )}
                            />
                            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                            {!isLogin && (
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            style={[
                                                styles.textInput,
                                                errors.confirmPassword && styles.errorInput,
                                                focus === "confirmPassword" && styles.focusedInput,
                                            ]}
                                            placeholder="Confirm Password"
                                            secureTextEntry
                                            value={value}
                                            onChangeText={onChange}
                                            textContentType="oneTimeCode"
                                            autoComplete="off"
                                            autoCapitalize="none"
                                            onFocus={() => setFocused("confirmPassword")}
                                            onBlur={() => setFocused("")}
                                        />
                                    )}
                                />
                            )}
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                            )}
                        </View>

                        <View style={[styles.buttonContainer, { overflow: "hidden", borderRadius: layout.borderRadius.xl }]}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    pressed && Platform.OS === "ios" ? { opacity: 0.7 } : null,
                                ]}
                                onPress={handleSubmit(onSubmit)}
                                android_ripple={{ color: colors.primary[700], borderless: false }}
                            >
                                <Text style={styles.buttonText}>{isLogin ? "Sign In" : "Create Account"}</Text>
                            </Pressable>
                        </View>

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
    buttonPressed:{
        opacity:0.5
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
    buttonContainer: {
        marginBottom: hp(1.5),
    },
    button: {
        backgroundColor: colors.primary[500],
        padding: hp(1.8),
        alignItems: "center",

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
    focusedInput: {
        borderColor: colors.primary[400],
        borderWidth: 2,
        ...Platform.select({
            ios: {
                shadowColor: colors.primary[400],
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            }
        }),
    },
});