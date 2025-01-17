import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { isPointInside } from '../../../utils/dragdrop';

const DraggableWord = ({ word, onDragStart, onDragEnd, dropZones }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.startX = translateX.value;
            context.startY = translateY.value;
            scale.value = withSpring(1.1);
            runOnJS(onDragStart)(word);
        },
        onActive: (event, context) => {
            translateX.value = context.startX + event.translationX;
            translateY.value = context.startY + event.translationY;
        },
        onEnd: (event) => {
            let dropped = false;
            const currentPosition = { x: event.absoluteX, y: event.absoluteY };

            for (const dropZone of dropZones) {
                if (isPointInside(currentPosition, dropZone.layout)) {
                    runOnJS(onDragEnd)({ word, dropZoneId: dropZone.id });
                    dropped = true;
                    break;
                }
            }

            if (!dropped) {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
            scale.value = withSpring(1);
        }
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.draggable, animatedStyle]}>
                <Text style={styles.wordText}>{word.word}</Text>
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    draggable: {
        padding: 10,
        backgroundColor: '#E9D5FF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        ...Platform.select({
            ios: { shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { height: 2, width: 2 } },
            android: { elevation: 5 },
        }),
    },
    wordText: {
        color: '#1F2937',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default DraggableWord;