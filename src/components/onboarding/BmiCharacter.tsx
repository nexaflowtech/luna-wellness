import * as React from 'react';
import { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import Svg, { Ellipse, Rect, Circle, Path } from 'react-native-svg';

interface BmiCharacterProps {
    gender: 'male' | 'female';
    bmi: number;
}

type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

// Color palette per BMI category
const CATEGORY_COLORS: Record<BmiCategory, { body: string; accent: string; glow: string }> = {
    underweight: { body: '#3B82F6', accent: '#60A5FA', glow: '#1D4ED8' },
    normal: { body: '#10B981', accent: '#34D399', glow: '#065F46' },
    overweight: { body: '#F59E0B', accent: '#FCD34D', glow: '#92400E' },
    obese: { body: '#EF4444', accent: '#FCA5A5', glow: '#7F1D1D' },
};

// Body shape parameters per BMI category
const BODY_PARAMS: Record<BmiCategory, { shoulderW: number; waistW: number; hipW: number; headR: number }> = {
    underweight: { shoulderW: 28, waistW: 18, hipW: 24, headR: 20 },
    normal: { shoulderW: 34, waistW: 26, hipW: 32, headR: 22 },
    overweight: { shoulderW: 44, waistW: 40, hipW: 48, headR: 25 },
    obese: { shoulderW: 56, waistW: 54, hipW: 60, headR: 29 },
};

// Simple animated SVG body character — purely native, no external assets needed
const CharacterSvg: React.FC<{ category: BmiCategory; gender: 'male' | 'female' }> = ({ category, gender }) => {
    const colors = CATEGORY_COLORS[category];
    const params = BODY_PARAMS[category];
    const cx = 60; // center x
    const headY = 32;
    const shoulderY = 70;
    const torsoH = 55;
    const hipY = shoulderY + torsoH;

    return (
        <Svg width="120" height="220" viewBox="0 0 120 220">
            {/* Glow circle behind body */}
            <Ellipse cx={cx} cy={130} rx={params.hipW + 16} ry={params.hipW + 8} fill={colors.glow} opacity={0.2} />

            {/* Head */}
            <Circle cx={cx} cy={headY} r={params.headR} fill={colors.body} />
            {/* Head shine */}
            <Circle cx={cx - params.headR * 0.3} cy={headY - params.headR * 0.3} r={params.headR * 0.22} fill="rgba(255,255,255,0.25)" />

            {/* Neck */}
            <Rect x={cx - 6} y={headY + params.headR - 2} width={12} height={10} fill={colors.body} rx={3} />

            {/* Body / Torso */}
            <Path
                d={`M ${cx - params.shoulderW} ${shoulderY}
            Q ${cx} ${shoulderY - 6} ${cx + params.shoulderW} ${shoulderY}
            Q ${cx + params.waistW} ${shoulderY + torsoH * 0.45} ${cx + params.hipW} ${hipY}
            Q ${cx} ${hipY + 6} ${cx - params.hipW} ${hipY}
            Q ${cx - params.waistW} ${shoulderY + torsoH * 0.45} ${cx - params.shoulderW} ${shoulderY}
            Z`}
                fill={colors.body}
            />

            {/* Torso highlight */}
            <Ellipse cx={cx} cy={shoulderY + 18} rx={params.waistW * 0.45} ry={12} fill="rgba(255,255,255,0.1)" />

            {/* Left arm */}
            <Ellipse cx={cx - params.shoulderW - 8} cy={shoulderY + 28} rx={gender === 'female' ? 7 : 8} ry={22} fill={colors.accent} />
            {/* Right arm */}
            <Ellipse cx={cx + params.shoulderW + 8} cy={shoulderY + 28} rx={gender === 'female' ? 7 : 8} ry={22} fill={colors.accent} />

            {/* Left leg */}
            <Ellipse cx={cx - params.hipW * 0.45} cy={hipY + 30} rx={gender === 'female' ? params.hipW * 0.28 : params.hipW * 0.3} ry={28} fill={colors.body} />
            {/* Right leg */}
            <Ellipse cx={cx + params.hipW * 0.45} cy={hipY + 30} rx={gender === 'female' ? params.hipW * 0.28 : params.hipW * 0.3} ry={28} fill={colors.body} />

            {/* Female hair indicator */}
            {gender === 'female' && (
                <Ellipse cx={cx} cy={headY - params.headR * 0.5} rx={params.headR * 0.9} ry={params.headR * 0.55} fill={colors.accent} />
            )}

            {/* Eyes */}
            <Circle cx={cx - 6} cy={headY - 2} r={3} fill="rgba(0,0,0,0.4)" />
            <Circle cx={cx + 6} cy={headY - 2} r={3} fill="rgba(0,0,0,0.4)" />
            {/* Smile */}
            <Path d={`M ${cx - 6} ${headY + 7} Q ${cx} ${headY + 12} ${cx + 6} ${headY + 7}`} stroke="rgba(0,0,0,0.4)" strokeWidth={2} fill="none" strokeLinecap="round" />
        </Svg>
    );
};

export const BmiCharacter: React.FC<BmiCharacterProps> = ({ gender, bmi }) => {
    const category = useMemo<BmiCategory>(() => {
        if (bmi < 18.5) return 'underweight';
        if (bmi < 25) return 'normal';
        if (bmi < 30) return 'overweight';
        return 'obese';
    }, [bmi]);

    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    const prevCategoryRef = useRef(category);

    useEffect(() => {
        if (prevCategoryRef.current !== category) {
            prevCategoryRef.current = category;
            opacity.value = withSequence(
                withTiming(0, { duration: 200 }),
                withTiming(1, { duration: 400 })
            );
            scale.value = withSequence(
                withTiming(0.92, { duration: 200 }),
                withTiming(1, { duration: 400 })
            );
        }
    }, [category]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const colors = CATEGORY_COLORS[category];
    const label = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <View style={styles.wrapper}>
            <Animated.View style={[styles.characterWrap, animatedStyle]}>
                <CharacterSvg category={category} gender={gender} />
            </Animated.View>
            <View style={[styles.badge, { backgroundColor: colors.body + '22', borderColor: colors.body + '55' }]}>
                <View style={[styles.dot, { backgroundColor: colors.body }]} />
                <Text style={[styles.badgeText, { color: colors.accent }]}>
                    {gender === 'male' ? 'Male' : 'Female'} · {label}
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
