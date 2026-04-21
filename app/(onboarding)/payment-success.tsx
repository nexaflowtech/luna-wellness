import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// Reanimated removed - plain View used instead
import { Check, Sparkles, Heart, Rocket } from 'lucide-react-native';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/src/config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';

export default function PaymentSuccessScreen() {
    const router = useRouter();
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSequence(
            withSpring(1.2, { damping: 6 }),
            withSpring(1.0, { damping: 10 })
        );

        // Auto-navigate to home after 5 seconds as a safety fallback
        const timer = setTimeout(() => {
            finalizeOnboarding();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const finalizeOnboarding = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), {
                    onboardingComplete: true,
                    subscriptionActive: true,
                    onboardingStep: 'complete',
                    updatedAt: serverTimestamp(),
                });
                // AuthContext onSnapshot will detect this change and _layout.tsx
                // will automatically redirect to (tabs)
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
        <SafeAreaView style={styles.container}>
            {/* Success Icon */}
            <View>
                <View>
                    <Check size={64} color="#006e2f" strokeWidth={3} />
                </View>
                <View>
                    <Sparkles size={28} color="#FACC15" />
                </View>
            </View>

            {/* Text */}
            <View>
                <Text style={styles.title}>Payment Successful!</Text>
                <Text style={styles.subtitle}>
                    Welcome to the Luna family. Your personalized plan is now active and ready for you.
                </Text>
            </View>

            {/* Badges */}
            <View style={styles.badgeRow}>
                <Badge icon={Heart} label="Healthy" color="#006e2f" delay={600} />
                <Badge icon={Rocket} label="Ready" color="#005ac2" delay={800} />
            </View>

            {/* CTA */}
            <View>
                <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={finalizeOnboarding}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={['#006e2f', '#006b5f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <Text style={styles.ctaText}>Go to My Dashboard</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.hint}>Your plan is already active and synced.</Text>
            </View>
        </SafeAreaView>
    );
}

function Badge({ icon: Icon, label, color, delay }: { icon: any; label: string; color: string; delay: number }) {
    return (
        <View>
            <View style={[styles.badgeIcon, { backgroundColor: `${color}18` }]}>
                <Icon size={24} color={color} />
            </View>
            <Text style={styles.badgeLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9ff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconWrapper: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(0, 110, 47, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(0, 110, 47, 0.2)',
    },
    sparkle: {
        position: 'absolute',
        top: -8,
        right: -8,
    },
    textBlock: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0b1c30',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#3d4a3d',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 16,
        fontWeight: '500',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 48,
    },
    badge: {
        alignItems: 'center',
    },
    badgeIcon: {
        padding: 16,
        borderRadius: 24,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeLabel: {
        color: '#3d4a3d',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    cta: {
        width: '100%',
        alignItems: 'center',
    },
    ctaBtn: {
        width: '100%',
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
    },
    gradient: {
        width: '100%',
        paddingVertical: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    hint: {
        marginTop: 16,
        color: '#6d7b6c',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});
