import {SafeAreaView, View,StyleSheet} from "react-native";
import {LinearGradient} from "expo-linear-gradient";

export default function ScreenWrapper({children,gradientColors=['#ffffff', '#f0f0f0'],style}) {
    return (
            <LinearGradient colors={gradientColors} style={styles.gradient} >
                <SafeAreaView style={[styles.container,style]}>
                    {children}
                </SafeAreaView>
            </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient:{
        flex:1
    }
})

