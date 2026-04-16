import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Check, Timer, Zap, Shield, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';

const PLANS = [
    {
        id: 'monthly',
        title: 'Monthly Plan',
        price: '₹2,499',
        period: '/mo',
        description: 'Perfect for starting out',
        isBestValue: false,
    },
    {
        id: 'quarterly',
        title: '3-Month Plan',
        price: '₹1,999',
        period: '/mo',
        description: 'Most selected by members',
        isBestValue: true,
    },
    {
        id: 'yearly',
        title: 'Annual Plan',
        price: '₹1,299',
        period: '/mo',
        description: 'Transform your lifestyle',
        isBestValue: false,
    },
];

export default function PricingScreen() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState('quarterly');
    const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const onProceed = () => {
        router.push('/(onboarding)/payment-success');
    };

    return (
        <ScreenWrapper>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    <View className="py-8">
                        <Animated.View entering={FadeInDown.duration(600).springify()}>
                            <Text className="text-textSecondary text-[13px] uppercase font-bold tracking-[3px] mb-2 text-center">
                                Step 5 of 6
                            </Text>
                            <Text className="text-textPrimary text-[32px] font-extrabold leading-[40px] mb-4 text-center">
                                Unlock Your <Text className="text-primary">Transformation</Text>
                            </Text>

                            {/* Offer Timer */}
                            <View className="bg-primary/10 self-center px-4 py-2 rounded-full flex-row items-center mb-8 border border-primary/20">
                                <Timer size={16} color="#7C3AED" />
                                <Text className="text-primary font-bold ml-2">Offer expires in {formatTime(timeLeft)}</Text>
                            </View>
                        </Animated.View>

                        {/* Inclusions */}
                        <Animated.View
                            entering={FadeInDown.delay(200)}
                            className="bg-surface/50 rounded-[32px] p-6 mb-8 border border-white/5"
                        >
                            <Text className="text-textPrimary font-bold text-lg mb-4">Your "Luna Advanced" Plan Includes:</Text>
                            {[
                                'Daily Live Zumba & Fitness Classes',
                                'AI-Balanced Macro Meal Plans',
                                '24/7 AI Health Coach (Eva)',
                                'Hormonal Symptom Tracking',
                                'Monthly Lab Report Analysis'
                            ].map((item, i) => (
                                <View key={i} className="flex-row items-center mb-3">
                                    <View className="bg-accent/20 rounded-full p-1 mr-3">
                                        <Check size={14} color="#22C55E" />
                                    </View>
                                    <Text className="text-textSecondary text-[15px]">{item}</Text>
                                </View>
                            ))}
                        </Animated.View>

                        {/* Pricing Options */}
                        {PLANS.map((plan, index) => (
                            <TouchableOpacity
                                key={plan.id}
                                activeOpacity={0.85}
                                onPress={() => setSelectedPlan(plan.id)}
                                className="mb-4"
                            >
                                <Animated.View
                                    entering={FadeInUp.delay(300 + index * 100)}
                                    className={`rounded-[28px] p-6 border-2 ${selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-white/5 bg-surface'
                                        }`}
                                >
                                    {plan.isBestValue && (
                                        <View className="absolute -top-3 left-6 bg-primary px-3 py-1 rounded-full">
                                            <Text className="text-white text-[10px] font-black uppercase tracking-wider">Most Popular</Text>
                                        </View>
                                    )}
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-1">
                                            <Text className={`text-lg font-bold ${selectedPlan === plan.id ? 'text-primary' : 'text-textPrimary'}`}>
                                                {plan.title}
                                            </Text>
                                            <Text className="text-textSecondary text-sm">{plan.description}</Text>
                                        </View>
                                        <View className="items-end">
                                            <View className="flex-row items-baseline">
                                                <Text className="text-textPrimary text-2xl font-black">{plan.price}</Text>
                                                <Text className="text-textSecondary text-xs">{plan.period}</Text>
                                            </View>
                                            <Text className="text-textSecondary text-[10px] line-through opacity-50">₹3,999</Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            </TouchableOpacity>
                        ))}

                        {/* Security Note */}
                        <View className="flex-row items-center justify-center opacity-50 mt-4 mb-20">
                            <Shield size={14} color="#A1A1AA" />
                            <Text className="text-textSecondary text-xs ml-2">Secure 256-bit encrypted checkout</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* CTA */}
                <View className="absolute bottom-0 left-0 right-0 p-6 bg-background/80" style={{ backdropFilter: 'blur(20px)' }}>
                    <PrimaryButton
                        title="Start My Transformation"
                        onPress={onProceed}
                        icon={<Zap size={20} color="#FFF" />}
                    />
                </View>
            </SafeAreaView>
        </ScreenWrapper>
    );
}
