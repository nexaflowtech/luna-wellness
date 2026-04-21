import * as React from 'react';
import { useMemo, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import Svg, { Ellipse, Rect, Circle, Path } from 'react-native-svg';

// react-native-reanimated removed — uses plain RN Animated API for Expo Go compatibility

export interface BmiCharacterProps {
    gender: 'male' | 'female';
    bmi: number;
}

type BmiCategory = 'lean' | 'fit' | 'bulky';

const CATEGORY_COLORS: Record<BmiCategory, { body: string; accent: string; glow: string }> = {
    lean: { body: '#60A5FA', accent: '#3B82F6', glow: '#1D4ED8' },
    fit: { body: '#22C55E', accent: '#10B981', glow: '#065F46' },
    bulky: { body: '#EF4444', accent: '#FCA5A5', glow: '#7F1D1D' },
};

const CHARACTER_ASSETS: Record<'male' | 'female', Record<BmiCategory, any>> = {
    male: {
        lean: require('../../../assets/characters/male_lean.png'),
        fit: require('../../../assets/characters/male_fit.png'),
        bulky: require('../../../assets/characters/male_bulky.png'),
    },
    female: {
        lean: require('../../../assets/characters/female_lean.png'),
        fit: require('../../../assets/characters/female_fit.png'),
        bulky: require('../../../assets/characters/female_bulky.png'),
    },
};

const FITNESS_LABELS: Record<BmiCategory, string> = {
    lean: 'Lean',
    fit: 'Fit',
    bulky: 'Bulky',
};

export const BmiCharacter: React.FC<BmiCharacterProps> = ({ gender, bmi }) => {
    const category = useMemo<BmiCategory>(() => {
        if (bmi < 18.5) return 'lean';
        if (bmi < 25) return 'fit';
        return 'bulky';
    }, [bmi]);

    // Plain RN Animated values (worklets-free)
    const opacity = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(1)).current;

    const prevCategoryRef = useRef(category);
    const prevGenderRef = useRef(gender);

    useEffect(() => {
        if (prevCategoryRef.current !== category || prevGenderRef.current !== gender) {
            prevCategoryRef.current = category;
            prevGenderRef.current = gender;

            // Morph transition: fade out → in
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(opacity, { toValue: 0.4, duration: 150, useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 0.95, duration: 150, useNativeDriver: true }),
                ]),
                Animated.parallel([
                    Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 1, duration: 350, useNativeDriver: true }),
                ]),
            ]).start();
        }
    }, [category, gender]);

    const colors = CATEGORY_COLORS[category];
    const fitnessLabel = FITNESS_LABELS[category];
    const assetUrl = CHARACTER_ASSETS[gender][category];

    return (
        <View style={styles.wrapper}>
            <Animated.View style={[styles.characterWrap, { opacity, transform: [{ scale }] }]}>
                {/* Glow Backdrop */}
                <View style={[styles.glow, { backgroundColor: colors.glow }]} />

                <Image
                    source={assetUrl}
                    style={styles.characterImage}
                    resizeMode="contain"
                />
            </Animated.View>

            <View style={[styles.badge, {
                backgroundColor: colors.body + '15',
                borderColor: colors.body + '40',
                shadowColor: colors.glow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            }]}>
                <View style={[styles.dot, { backgroundColor: colors.body }]} />
                <Text style={[styles.badgeText, { color: colors.body }]}>
                    {gender} · {fitnessLabel}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    characterWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: 220,
        height: 280,
    },
    glow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        opacity: 0.15,
        bottom: 20,
        zIndex: -1,
    },
    characterImage: {
        width: '100%',
        height: '100%',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
