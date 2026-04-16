import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    ZoomIn,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { Check, Sparkles, Heart, Rocket } from 'lucide-react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/src/config/firebase';

import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';

export default function PaymentSuccessScreen() {
    const router = useRouter();
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSequence(
            withSpring(1.2),
            withSpring(1.0)
        );
    }, []);

    const onFinalize = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), {
                    onboardingComplete: true,
                    subscriptionActive: true,
                    onboardingStep: 'complete',
                    updatedAt: new Date().toISOString()
                });
                // The root auth guard will automatically detect this change
                // and redirect to (tabs)
            } catch (error) {
                console.error('Error finalizing onboarding:', error);
                router.replace('/(tabs)');
            }
        } else {
            router.replace('/(tabs)');
        }
    };

    const checkAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <ScreenWrapper>
            <SafeAreaView className="flex-1 items-center justify-center px-6">
                <Animated.View
                    entering={ZoomIn.duration(800)}
                    className="w-32 h-32 rounded-full bg-accent/20 items-center justify-center mb-10 border border-accent/30"
                >
                    <Animated.View style={checkAnimatedStyle}>
                        <Check size={64} color="#22C55E" strokeWidth={3} />
                    </Animated.View>

                    <Animated.View
                        entering={FadeIn.delay(1000)}
                        className="absolute -top-2 -right-2"
                    >
                        <Sparkles size={32} color="#FACC15" />
                    </Animated.View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).duration(600).springify()}>
                    <Text className="text-textPrimary text-[32px] font-black text-center mb-4">
                        Payment Successful!
                    </Text>
                    <Text className="text-textSecondary text-[16px] text-center leading-[24px] mb-12 px-4">
                        Welcome to the Luna family. Your personalized "Zumba + Diet + Coach" plan is now active and ready for you.
                    </Text>
                </Animated.View>

                <View className="flex-row gap-6 mb-16">
                    <Badge icon={Heart} label="Healthy" color="#EF4444" delay={600} />
                    <Badge icon={Rocket} label="Ready" color="#7C3AED" delay={800} />
                </View>

                <Animated.View
                    entering={FadeInUp.delay(1200)}
                    className="w-full"
                >
                    <PrimaryButton
                        title="Go to Dashboard"
                        onPress={onFinalize}
                    />
                </Animated.View>
            </SafeAreaView>
        </ScreenWrapper>
    );
}

function Badge({ icon: Icon, label, color, delay }: { icon: any, label: string, color: string, delay: number }) {
    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(600)}
            className="items-center"
        >
            <View style={{ backgroundColor: `${color}20` }} className="p-4 rounded-3xl mb-2 items-center justify-center border border-white/5">
                <Icon size={24} color={color} />
            </View>
            <Text className="text-textSecondary text-xs font-bold uppercase tracking-widest">{label}</Text>
        </Animated.View>
    );
}
