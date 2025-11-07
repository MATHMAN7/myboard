import React, { useState } from 'react';
import { View, PanResponder, StyleSheet, Button, TouchableOpacity, Text } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

export default function Board() {
    type Point = {
        x: number;
        y: number;
        time: number;
    };

    type Stroke = {
        points: Point[];
        color: string;
    };

    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [redoStack, setRedoStack] = useState<Stroke[]>([]);
    const [currentColor, setCurrentColor] = useState('black');
    const [boardColor, setBoardColor] = useState('#f2f2f2');

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,

        onPanResponderGrant: (evt) => {
            const point: Point = {
                x: evt.nativeEvent.locationX,
                y: evt.nativeEvent.locationY,
                time: Date.now(),
            };
            setStrokes([...strokes, { points: [point], color: currentColor }]);
            setRedoStack([]); // clear redo history after a new stroke
        },

        onPanResponderMove: (evt) => {
            const point: Point = {
                x: evt.nativeEvent.locationX,
                y: evt.nativeEvent.locationY,
                time: Date.now(),
            };
            setStrokes((prev) => {
                const newStrokes = [...prev];
                newStrokes[newStrokes.length - 1].points.push(point);
                return newStrokes;
            });
        },
    });

    const clearBoard = () => {
        setStrokes([]);
        setRedoStack([]);
    };

    const undo = () => {
        if (strokes.length === 0) return;
        const newStrokes = [...strokes];
        const popped = newStrokes.pop();
        setRedoStack([...redoStack, popped!]);
        setStrokes(newStrokes);
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const newRedo = [...redoStack];
        const restored = newRedo.pop();
        setStrokes([...strokes, restored!]);
        setRedoStack(newRedo);
    };

    const toggleBoardColor = () => {
        setBoardColor((prev) => (prev === '#f2f2f2' ? '#000' : '#f2f2f2'));
    };

    const colors = ['black', 'blue', 'red', 'green', 'yellow', 'white'];

    return (
        <View style={styles.container}>
            <View style={[styles.board, { backgroundColor: boardColor }]} {...panResponder.panHandlers}>
                <Svg style={{ flex: 1 }}>
                    {strokes.map((stroke, index) => (
                        <Polyline
                            key={index}
                            points={stroke.points.map((p) => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke={stroke.color}
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </Svg>
            </View>

            <View style={styles.toolbar}>
                <TouchableOpacity onPress={clearBoard} style={styles.button}>
                    <Text style={styles.text}>🧹</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={undo} style={styles.button}>
                    <Text style={styles.text}>↩</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={redo} style={styles.button}>
                    <Text style={styles.text}>↪</Text>
                </TouchableOpacity>

                {colors.map((c) => (
                    <TouchableOpacity
                        key={c}
                        onPress={() => setCurrentColor(c)}
                        style={[styles.colorButton, { backgroundColor: c, borderColor: currentColor === c ? 'gray' : 'transparent' }]}
                    />
                ))}

                <TouchableOpacity onPress={toggleBoardColor} style={styles.button}>
                    <Text style={styles.text}>⚫/⚪</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    board: {
        flex: 1,
    },
    toolbar: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        padding: 8,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        padding: 8,
    },
    text: {
        fontSize: 20,
    },
    colorButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginHorizontal: 4,
        borderWidth: 2,
    },
});
