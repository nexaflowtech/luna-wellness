import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
// Reanimated removed — plain View used instead
import { Check, Timer, Zap, Shield, ArrowRight, Star, Award, Tag, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { useAuth } from '@/src/context/AuthContext';
import { updateUserDoc } from '@/src/services/authService';
import { db } from '@/src/config/firebase';

const BASE_PRICE = 999;

// Razorpay key — set in .env as EXPO_PUBLIC_RAZORPAY_KEY_ID
const RAZORPAY_KEY_ID = process.env['EXPO_PUBLIC_RAZORPAY_KEY_ID'] ?? 'rzp_test_placeholder';

interface Plan {
    id: string;
    title: string;
    priceNum: number;
    price: string;
    originalPrice: string;
    period: string;
    billed: string;
    save: string;
    isPopular: boolean;
    durationMonths: 1 | 3 | 6;
}

const PLANS: Plan[] = [
    {
        id: '1_month',
        title: '1 Month Base',
        priceNum: BASE_PRICE,
        price: `₹${BASE_PRICE}`,
        originalPrice: `₹${Math.round(BASE_PRICE * 1.5)}`,
        period: '/mo',
        billed: 'Billed monthly',
        save: 'STANDARD',
        isPopular: false,
        durationMonths: 1,
    },
    {
        id: '3_months',
        title: '3 Months Accelerated',
        priceNum: Math.round(BASE_PRICE * 3 * 0.7),
        price: `₹${Math.round(BASE_PRICE * 3 * 0.7)}`,
        originalPrice: `₹${BASE_PRICE * 3}`,
        period: '/3mo',
        billed: 'Billed every 3 months',
        save: 'SAVE 30%',
        isPopular: true,
        durationMonths: 3,
    },
    {
        id: '6_months',
        title: '6 Months Lasting',
        priceNum: Math.round(BASE_PRICE * 6 * 0.5),
        price: `₹${Math.round(BASE_PRICE * 6 * 0.5)}`,
        originalPrice: `₹${BASE_PRICE * 6}`,
        period: '/6mo',
        billed: 'Billed every 6 months',
        save: 'SAVE 50%',
        isPopular: false,
        durationMonths: 6,
    },
];

// Valid coupon codes (extend as needed — ideally fetched from backend)
const VALID_COUPONS: Record<string, number> = {
    LUNA10: 10,
    LUNA20: 20,
    WELCOME50: 50,
};

export default function PricingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState('3_months');
    const [timeLeft, setTimeLeft] = useState(900); // 15 mins
    const [isProcessing, setIsProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0); // percentage
    const [couponError, setCouponError] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const currentPlan = PLANS.find(p => p.id === selectedPlan)!;
    const discountedPrice = appliedDiscount > 0
        ? Math.round(currentPlan.priceNum * (1 - appliedDiscount / 100))
        : currentPlan.priceNum;

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

    const handleApplyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        if (!code) return;
        const discount = VALID_COUPONS[code];
        if (discount) {
            setAppliedDiscount(discount);
            setCouponApplied(true);
            setCouponError('');
        } else {
            setCouponError('Invalid coupon code. Please try again.');
            setAppliedDiscount(0);
            setCouponApplied(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setAppliedDiscount(0);
        setCouponApplied(false);
        setCouponError('');
    };

    const activatePlan = async (paymentId: string) => {
        if (!user?.uid) return;

        const plan = currentPlan;
        const start = new Date();
        const end = new Date();
        end.setMonth(start.getMonth() + plan.durationMonths);

        // Write subscription record
        await addDoc(collection(db, 'subscriptions'), {
            uid: user.uid,
            plan_id: plan.id,
            plan_type: plan.title,
            duration_months: plan.durationMonths,
            price_paid: discountedPrice,
            currency: 'INR',
            payment_id: paymentId,
            coupon_applied: couponApplied ? couponCode.toUpperCase() : null,
            discount_percent: appliedDiscount,
            start_date: start.toISOString(),
            end_date: end.toISOString(),
            status: 'active',
            features: ['Workout', 'Diet', 'Coach', 'AI'],
            created_at: serverTimestamp(),
        });

        // Update user document
        await updateUserDoc(user.uid, {
            activePlan: {
                plan_id: plan.id,
                plan_type: plan.title,
                duration_months: plan.durationMonths,
                start_date: start.toISOString(),
                end_date: end.toISOString(),
                features: ['Workout', 'Diet', 'Coach', 'AI'],
            },
            subscriptionActive: true,
            onboardingComplete: true,
            onboardingStep: 'complete',
        });
    };

    const onProceed = async () => {
        if (!user) {
            Alert.alert('Error', 'Please log in first.');
            return;
        }

        setIsProcessing(true);
        setPaymentError('');

        try {
            const options = {
                description: `Luna Wellness – ${currentPlan.title}`,
                currency: 'INR',
                key: RAZORPAY_KEY_ID,
                amount: discountedPrice * 100, // Razorpay takes paise
                name: 'Luna Wellness',
                prefill: {
                    contact: user.phoneNumber ?? '',
                    email: user.email ?? '',
                },
                theme: { color: '#006e2f' },
            };

            const paymentData = await RazorpayCheckout.open(options);
            // paymentData.razorpay_payment_id is populated on success
            const paymentId = (paymentData as any).razorpay_payment_id ?? 'mock_' + Date.now();

            await activatePlan(paymentId);
            router.push('/(onboarding)/payment-success');
        } catch (err: any) {
            const code = err?.code ?? '';
            const description = err?.description ?? '';

            if (code === 0 || description.toLowerCase().includes('cancel')) {
                // User cancelled — don't show error, just let them retry
                setPaymentError('Payment was cancelled. Your plan was not activated.');
            } else {
                console.error('[Pricing] Payment error:', err);
                setPaymentError('Payment failed. Please try again or contact support.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <View className="flex-1 bg-surface-bright">
            {/* Header */}
            <View className="w-full px-8 pt-16 pb-6 flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                    <Star color="#006e2f" size={24} />
                    <Text className="text-xl font-extrabold text-on-surface tracking-tighter">Luna Wellness</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 180 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero */}
                <View>
                    <Text className="text-[40px] font-extrabold text-on-surface tracking-tighter leading-[48px]">
                        Unlock Your Full Potential
                    </Text>

                    <View className="bg-[#e6f0ea] self-start px-5 py-2.5 rounded-full flex-row items-center mt-6 border border-primary/20">
                        <Timer size={16} color="#006e2f" />
                        <Text className="text-primary font-bold ml-2 text-sm tracking-tight">
                            Offer expires in {formatTime(timeLeft)}
                        </Text>
                    </View>
                </View>

                {/* Plan Cards */}
                <View className="flex-col gap-4 mb-10">
                    {PLANS.map((plan, index) => {
                        const isActive = selectedPlan === plan.id;
                        return (
                            <TouchableOpacity key={plan.id} activeOpacity={0.9} onPress={() => { setSelectedPlan(plan.id); setPaymentError(''); }}>
                                <View>
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
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Coupon Section */}
                <View>
                    {couponApplied ? (
                        <View className="flex-row items-center justify-between bg-[#e6f0ea] px-6 py-4 rounded-2xl border border-primary/20">
                            <View className="flex-row items-center gap-3">
                                <Tag size={16} color="#006e2f" />
                                <Text className="text-primary font-bold text-sm">{couponCode.toUpperCase()} — {appliedDiscount}% OFF</Text>
                            </View>
                            <TouchableOpacity onPress={handleRemoveCoupon}>
                                <X size={18} color="#888" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="flex-row gap-3">
                            <TextInput
                                value={couponCode}
                                onChangeText={text => { setCouponCode(text); setCouponError(''); }}
                                placeholder="Coupon code"
                                placeholderTextColor="#bccbb9"
                                autoCapitalize="characters"
                                className="flex-1 bg-surface-container-low rounded-2xl px-5 py-4 text-on-surface font-bold text-base border-2 border-transparent focus:border-primary"
                            />
                            <TouchableOpacity
                                onPress={handleApplyCoupon}
                                className="bg-primary px-6 rounded-2xl items-center justify-center"
                                activeOpacity={0.85}
                            >
                                <Text className="text-white font-bold text-sm">Apply</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {couponError ? (
                        <Text className="text-error text-xs font-bold mt-2 ml-1">{couponError}</Text>
                    ) : null}
                </View>

                {/* Price Summary */}
                {appliedDiscount > 0 && (
                    <View>
                        <Text className="text-on-surface font-bold">Final Price</Text>
                        <View className="flex-row items-baseline gap-2">
                            <Text className="text-on-surface-variant text-sm line-through opacity-50">₹{currentPlan.priceNum}</Text>
                            <Text className="text-primary text-2xl font-extrabold">₹{discountedPrice}</Text>
                        </View>
                    </View>
                )}

                {/* Value Props */}
                <View>
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
                </View>

                {/* Trust */}
                <View>
                    <View className="p-3 bg-[#dce9ff] rounded-2xl">
                        <Award color="#005ac2" size={24} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[10px] font-bold text-tertiary uppercase tracking-[2px] mb-1">Certified Platform</Text>
                        <Text className="text-sm text-on-surface-variant leading-relaxed font-bold">
                            Luna Wellness follows clinical-grade data security protocols and is certified by the Global Health AI Alliance.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Footer CTA */}
            <View className="absolute bottom-0 left-0 w-full p-8 bg-surface-bright">
                {paymentError ? (
                    <View className="bg-error-container/40 px-4 py-3 rounded-2xl mb-4 border border-error/20">
                        <Text className="text-error text-xs font-semibold text-center">{paymentError}</Text>
                    </View>
                ) : null}
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
                            {isProcessing ? 'Opening Secure Checkout...' : `Claim My Offer · ₹${discountedPrice}`}
                        </Text>
                        {!isProcessing && <ArrowRight color="white" size={24} />}
                    </LinearGradient>
                </TouchableOpacity>
                <View className="flex-row items-center justify-center mt-6 gap-2">
                    <Shield size={12} color="#6d7b6c" />
                    <Text className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">
                        Secure Encrypted Checkout via Razorpay
                    </Text>
                </View>
            </View>
        </View>
    );
}
