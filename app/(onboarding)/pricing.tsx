import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Check, Timer, Zap, Shield, ArrowRight, Star, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';

const { width } = Dimensions.get('window');

const BASE_PRICE = 999;

const PLANS = [
    {
        id: '1_month',
        title: '1 Month Base',
        price: `₹${BASE_PRICE}`,
        originalPrice: `₹${Math.round(BASE_PRICE * 1.5)}`,
        period: '/mo',
        billed: 'Billed monthly',
        save: 'STANDARD',
        isPopular: false,
    },
    {
        id: '3_months',
        title: '3 Months Accelerated',
        price: `₹${Math.round((BASE_PRICE * 3) * 0.7)}`,
        originalPrice: `₹${BASE_PRICE * 3}`,
        period: '/3mo',
        billed: 'Billed every 3 months',
        save: 'SAVE 30%',
        isPopular: true,
    },
    {
        id: '6_months',
        title: '6 Months Lasting',
        price: `₹${Math.round((BASE_PRICE * 6) * 0.5)}`,
        originalPrice: `₹${BASE_PRICE * 6}`,
        period: '/6mo',
        billed: 'Billed every 6 months',
        save: 'SAVE 50%',
        isPopular: false,
    },
];

export default function PricingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState('3_months');
    const [timeLeft, setTimeLeft] = useState(900); // 15 mins
    const [isProcessing, setIsProcessing] = useState(false);

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

    const onProceed = async () => {
        setIsProcessing(true);
        try {
            // STEP 1: Create Order (Backend Mock)
            await new Promise(r => setTimeout(r, 800));

            // STEP 2: Open Payment Gateway -> Verify (Mock behavior for Stripe/Razorpay)
            await new Promise(r => setTimeout(r, 1500));

            // STEP 3: Post Payment Logic -> Store in DB
            if (user?.uid) {
                const durationMonths = selectedPlan === '1_month' ? 1 : selectedPlan === '3_months' ? 3 : 6;
                const start = new Date();
                const end = new Date();
                end.setMonth(start.getMonth() + durationMonths);

                await updateUserDoc(user.uid, {
                    activePlan: {
                        plan_type: selectedPlan,
                        duration: durationMonths,
                        start_date: start.toISOString(),
                        end_date: end.toISOString(),
                        features: ["Workout", "Diet", "Coach", "AI"]
                    },
                    onboardingComplete: true,
                    onboardingStep: '/(tabs)',
                });
            }

            // STEP 4: Navigate Forward
            router.push('/(onboarding)/payment-success');
        } catch (e) {
            console.error("Payment Error:", e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <View className="flex-1 bg-surface-bright">
            {/* Header branding */}
            <View className="w-full px-8 pt-16 pb-6 flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                    <Star color="#006e2f" size={24} />
                    <Text className="text-xl font-extrabold text-on-surface tracking-tighter">Luna Wellness</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero section */}
                <Animated.View entering={FadeInDown.duration(600).springify()} className="mt-4 mb-8">
                    <Text className="text-[40px] font-extrabold text-on-surface tracking-tighter leading-[48px]">
                        Unlock Your Full Potential
                    </Text>

                    {/* Urgency Chip */}
                    <View className="bg-[#e6f0ea] self-start px-5 py-2.5 rounded-full flex-row items-center mt-6 border border-primary/20">
                        <Timer size={16} color="#006e2f" />
                        <Text className="text-primary font-bold ml-2 text-sm tracking-tight">Offer expires in {formatTime(timeLeft)}</Text>
                    </View>
                </Animated.View>

                {/* Plan Selection Bento */}
                <View className="flex-col gap-4 mb-10">
                    {PLANS.map((plan, index) => {
                        const isActive = selectedPlan === plan.id;
                        return (
                            <TouchableOpacity
                                key={plan.id}
                                activeOpacity={0.9}
                                onPress={() => setSelectedPlan(plan.id)}
                            >
                                <Animated.View
                                    entering={FadeInUp.delay(200 + index * 100)}
                                    className={`rounded-[32px] p-8 border-2 relative overflow-hidden ${isActive ? 'border-primary bg-surface-container-lowest shadow-sm' : 'border-transparent bg-surface-container-low'
                                        }`}
                                >
                                    {plan.isPopular && (
                                        <View className="absolute top-0 right-0 bg-primary px-6 py-2 rounded-bl-3xl">
                                            <Text className="text-white text-[10px] font-black uppercase tracking-widest">Most Popular</Text>
                                        </View>
                                    )}

                                    <View className="flex-row justify-between items-center">
                                        <View>
                                            <Text className="text-[10px] font-bold text-primary uppercase tracking-[2px] mb-1">{plan.save}</Text>
                                            <Text className="text-2xl font-extrabold text-on-surface tracking-tight mb-1">{plan.title}</Text>
                                            <Text className="text-on-surface-variant text-xs font-bold">{plan.billed}</Text>
                                        </View>
                                        <View className="items-end">
                                            <View className="flex-row items-baseline">
                                                <Text className="text-[40px] font-extrabold text-on-surface tracking-tighter">{plan.price}</Text>
                                                <Text className="text-on-surface-variant font-bold text-sm ml-1">{plan.period}</Text>
                                            </View>
                                            <Text className="text-on-surface-variant text-[11px] font-bold line-through opacity-40">{plan.originalPrice}</Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Value Props checklist */}
                <Animated.View
                    entering={FadeInDown.delay(500)}
                    className="bg-surface-container-lowest rounded-[40px] p-8 shadow-sm border border-white mb-10"
                >
                    <Text className="text-xl font-extrabold text-on-surface tracking-tight mb-8">Your Plan Includes:</Text>
                    {[
                        'Daily Live AI-Driven Fitness Sessions',
                        'Precision Nutrition & Macro Tracking',
                        '24/7 AI Health Intelligence Portal',
                        'Hormonal Peak & Valley Analysis',
                        'Monthly Clinical Insight Reports'
                    ].map((item, i) => (
                        <View key={i} className="flex-row items-center mb-5">
                            <View className="bg-[#e6f0ea] rounded-xl p-2 mr-4">
                                <Check size={16} color="#006e2f" strokeWidth={3} />
                            </View>
                            <Text className="text-on-surface-variant text-[15px] font-bold leading-tight flex-1">{item}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* Trust Section */}
                <Animated.View
                    entering={FadeInDown.delay(600)}
                    className="bg-surface-container-low p-6 rounded-[32px] border border-white/50 flex-row gap-4 items-start mb-8"
                >
                    <View className="p-3 bg-[#dce9ff] rounded-2xl">
                        <Award color="#005ac2" size={24} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[10px] font-bold text-tertiary uppercase tracking-[2px] mb-1">Certified Platform</Text>
                        <Text className="text-sm text-on-surface-variant leading-relaxed font-bold">
                            Luna Wellness follows clinical-grade data security protocols and is certified by the Global Health AI Alliance.
                        </Text>
                    </View>
                </Animated.View>

            </ScrollView>

            {/* Sticky Action Footer */}
            <View className="absolute bottom-0 left-0 w-full p-8 bg-surface-bright">
                <TouchableOpacity
                    className={`rounded-[28px] overflow-hidden shadow-md ${isProcessing ? 'opacity-70' : ''}`}
                    onPress={onProceed}
                    activeOpacity={0.9}
                    disabled={isProcessing}
                >
                    <LinearGradient
                        colors={['#006e2f', '#006b5f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-full py-6 items-center justify-center flex-row gap-3"
                    >
                        <Text className="text-white font-extrabold text-xl tracking-tight">
                            {isProcessing ? 'Processing Secure Route...' : 'Claim My Offer'}
                        </Text>
                        {!isProcessing && <ArrowRight color="white" size={24} />}
                    </LinearGradient>
                </TouchableOpacity>
                <View className="flex-row items-center justify-center mt-6 gap-2">
                    <Shield size={12} color="#6d7b6c" />
                    <Text className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">
                        Secure Encrypted Checkout
                    </Text>
                </View>
            </View>
        </View>
    );
}
