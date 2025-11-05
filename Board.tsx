import React, { useState } from 'react';
import { View, PanResponder, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

export default function Board() {
    type Point = {
        x: number;
        y: number;
        time: number;
    };

    const [strokes, setStrokes] = useState<Point[][]>([]);

    const { width, height } = Dimensions.get('window'); // get screen size

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,

        onPanResponderGrant: (evt) => {
            const point: Point = {
                x: evt.nativeEvent.locationX,
                y: evt.nativeEvent.locationY,
                time: Date.now(),
            };
            setStrokes([...strokes, [point]]);
        },

        onPanResponderMove: (evt) => {
            const point: Point = {
                x: evt.nativeEvent.locationX,
                y: evt.nativeEvent.locationY,
                time: Date.now(),
            };
            setStrokes((prev) => {
                const newStrokes = [...prev];
                newStrokes[newStrokes.length - 1].push(point);
                return newStrokes;
            });
        },
    });

    return (
        <View style={styles.board} {...panResponder.panHandlers}>
            <Svg width={width} height={height}>
                {strokes.map((stroke, index) => (
                    <Polyline
                        key={index}
                        points={stroke.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="black"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    board: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
});
