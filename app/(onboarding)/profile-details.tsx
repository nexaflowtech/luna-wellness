import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Sparkles,
  Utensils,
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { useAuth } from '@/src/context/AuthContext';
import { saveProfileSetup } from '@/src/services/onboardingService';
import { LunaAiService, OnboardingPlanResult } from '@/src/services/lunaAiService';
import { Colors, FontWeight, Radius, Shadow, Spacing, Typography } from '@/src/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

type Step = 1 | 2 | 3 | 4;
type Gender = 'female' | 'male' | 'other';

const CHARACTER_VARIANTS: Record<Gender, string[]> = {
  female: [
    'https://images.unsplash.com/photo-1518310952931-b1de897abd40?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=80',
  ],
  male: [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1567013127542-490d757e6349?auto=format&fit=crop&w=700&q=80',
  ],
  other: [
    'https://images.unsplash.com/photo-1521805103421-3f2555e6b8b4?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1539614474468-f423a2d2270c?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=700&q=80',
  ],
};

const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));

// ─── Step Progress ────────────────────────────────────────────────────────────
function StepProgress({ step }: { step: Step }) {
  const bars = [1, 2, 3];
  return (
    <View style={s.progressRow}>
      {bars.map((b) => (
        <View key={b} style={s.progressBarWrap}>
          <View style={s.progressBarBg} />
          {b <= Math.min(step, 3) && (
            <LinearGradient
              colors={['#fc695d', '#b7004e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.progressBarFill}
            />
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Carousel Dots ────────────────────────────────────────────────────────────
function CarouselDots({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <View style={s.dotRail}>
      {Array.from({ length: count }).map((_, i) =>
        i === activeIndex ? (
          <LinearGradient
            key={i}
            colors={['#fc695d', '#b7004e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.dotActive}
          />
        ) : (
          <View key={i} style={s.dot} />
        )
      )}
    </View>
  );
}

// ─── 3-D Metric Stepper Card ──────────────────────────────────────────────────
function MetricStepper({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <View style={s.metricCard}>
      {/* 3-D top highlight */}
      <View style={s.metricHighlight} />
      <Text style={s.metricLabel}>{label}</Text>
      <View style={s.metricValueRow}>
        <Text style={s.metricValue}>{value}</Text>
        <Text style={s.metricUnit}> {unit}</Text>
      </View>

      <View style={s.metricTrack}>
        <LinearGradient
          colors={['#fc695d', '#b7004e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[s.metricFill, { width: `${pct}%` }]}
        />
      </View>

      <View style={s.metricControls}>
        <TouchableOpacity
          style={s.metricBtn}
          onPress={() => onChange(clamp(value - 1, min, max))}
          activeOpacity={0.8}
        >
          <Text style={s.metricBtnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.metricBtn, s.metricBtnPlus]}
          onPress={() => onChange(clamp(value + 1, min, max))}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#fc695d', '#b7004e']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={[s.metricBtnText, { color: '#fff' }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── SVG Weight Chart ─────────────────────────────────────────────────────────
function WeightChart({ startWeight, endWeight, months }: { startWeight: number; endWeight: number; months: number }) {
  const w = SCREEN_W - 48;
  const h = 172;
  const sx = 20, ex = w - 20, sy = 36, ey = h - 28;
  const curve = `M ${sx} ${sy} C 90 34, ${ex * 0.55} ${ey - 40}, ${ex} ${ey}`;
  const area = `${curve} L ${ex} ${h - 4} L ${sx} ${h - 4} Z`;

  return (
    <View style={s.chartCard}>
      <View style={s.chartHighlight} />
      <Svg width={w} height={h}>
        <Defs>
          <SvgGrad id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffd9df" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#ffd9df" stopOpacity="0.1" />
          </SvgGrad>
          <SvgGrad id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#fc695d" />
            <Stop offset="1" stopColor="#b7004e" />
          </SvgGrad>
        </Defs>
        <Path d={area} fill="url(#areaGrad)" />
        <Path d={curve} fill="none" stroke="url(#lineGrad)" strokeWidth={3.5} />
        <Circle cx={sx} cy={sy} r={5} fill="#fff" stroke="#fc695d" strokeWidth={2.5} />
        <Circle cx={ex} cy={ey} r={5} fill="#fff" stroke="#b7004e" strokeWidth={2.5} />
        <Rect x={sx - 8} y={sy - 22} width={58} height={22} rx={11} fill="#fc695d" />
        <SvgText x={sx + 21} y={sy - 7} fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">
          {startWeight} kg
        </SvgText>
        <Rect x={ex - 50} y={ey - 24} width={58} height={22} rx={11} fill="#b7004e" />
        <SvgText x={ex - 21} y={ey - 9} fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">
          {endWeight} kg
        </SvgText>
      </Svg>
      <View style={s.chartFooter}>
        <Text style={s.chartLabel}>Now</Text>
        <View style={s.chartPill}>
          <Text style={s.chartPillText}>{'< '}{months} months{' >'}</Text>
        </View>
        <Text style={s.chartLabel}>Goal</Text>
      </View>
    </View>
  );
}

// ─── AI Loading Ring ──────────────────────────────────────────────────────────
function AiRing({ progress }: { progress: number }) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 2200, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);
  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={s.ringWrap}>
      {/* Static background ring */}
      <View style={s.ringBase} />
      {/* Spinning gradient arc */}
      <Animated.View style={[s.ringArc, { transform: [{ rotate: spin }] }]}>
        <LinearGradient
          colors={['#fc695d', '#b7004e', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
      {/* Centre label */}
      <View style={s.ringCenter}>
        <Text style={s.ringPct}>{progress}%</Text>
        <Text style={s.ringSubLabel}>Analyzing</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileDetailsScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ gender?: string; goals?: string; adaptive?: string }>();
  const gender = (params.gender as Gender) || 'female';
  const selectedGoals = useMemo(
    () => String(params.goals ?? '').split(',').map((g) => g.trim()).filter(Boolean),
    [params.goals]
  );
  const adaptiveAnswers = useMemo(() => {
    try {
      return params.adaptive ? JSON.parse(decodeURIComponent(params.adaptive)) : {};
    } catch {
      return {};
    }
  }, [params.adaptive]);

  const [step, setStep] = useState<Step>(1);
  const [weightKg, setWeightKg] = useState(60);
  const [heightCm, setHeightCm] = useState(168);
  const [desiredWeightKg, setDesiredWeightKg] = useState(55);
  const [age, setAge] = useState(27);
  const [bodyIndex, setBodyIndex] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiPlan, setAiPlan] = useState<OnboardingPlanResult | null>(null);
  const [saving, setSaving] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const variants = CHARACTER_VARIANTS[gender] ?? CHARACTER_VARIANTS.other;
  const characterImage = variants[bodyIndex] ?? variants[0];

  useEffect(() => { setBodyIndex(0); }, [gender]);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(24);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [step]);

  useEffect(() => {
    if (step !== 3) return;
    
    let isCancelled = false;
    setAiProgress(0);

    // Fake progress loading up to 90% while waiting for API
    const loadingInterval = setInterval(() => {
      setAiProgress(p => p < 90 ? p + 2 : 90);
    }, 100);

    const generatePlan = async () => {
      try {
        const result = await LunaAiService.generateOnboardingPlan({
          age, gender, heightCm, weightKg, targetWeightKg: desiredWeightKg, primaryGoals: selectedGoals, adaptiveAnswers
        });
        if (!isCancelled) {
          setAiPlan(result);
          clearInterval(loadingInterval);
          setAiProgress(100);
          setTimeout(() => setStep(4), 400);
        }
      } catch (err) {
        if (!isCancelled) {
          clearInterval(loadingInterval);
          Alert.alert("Plan Generation Error", "Could not generate plan.");
          setStep(2);
        }
      }
    };

    generatePlan();

    return () => {
      isCancelled = true;
      clearInterval(loadingInterval);
    };
  }, [step, age, gender, heightCm, weightKg, desiredWeightKg, selectedGoals]);

  const bmi = useMemo(() => {
    const hm = heightCm / 100;
    return weightKg / (hm * hm);
  }, [heightCm, weightKg]);

  const bmiCategory = useMemo(() => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#fc695d' };
    if (bmi < 25) return { label: 'Healthy', color: '#2e7d32' };
    if (bmi < 30) return { label: 'Overweight', color: '#e21364' };
    return { label: 'Obese', color: '#b7004e' };
  }, [bmi]);

  const goalDelta = weightKg - desiredWeightKg;

  const handleNext = async () => {
    if (step === 1) { setStep(2); return; }
    if (step === 2) { setStep(3); return; }
    if (step === 3 || !user) return;
    setSaving(true);
    try {
      await saveProfileSetup(user.uid, {
        name: user.displayName ?? 'Luna User',
        age, gender, heightCm, weightKg,
        primaryGoals: selectedGoals,
        dynamicDetails: { desiredWeightKg, bmi: Number(bmi.toFixed(1)), aiPlan: aiPlan ?? {}, adaptiveAnswers, bodyVariant: bodyIndex },
      });
      router.push('/(onboarding)/questionnaire');
    } catch {
      Alert.alert('Save failed', 'Could not save your profile details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      {/* ── Soft background gradient */}
      <LinearGradient
        colors={['#ffd9df', '#faf8ff', '#faf8ff']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
      />

      {/* ── Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep((step - 1) as Step) : router.back())}
          style={s.backBtn}
          activeOpacity={0.85}
        >
          <ArrowLeft color={Colors.primary} size={20} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.headerLogo}>Luna</Text>
          <View style={s.headerDot} />
        </View>

        <View style={{ width: 44 }} />
      </View>

      {/* ── Step progress */}
      <StepProgress step={step} />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ══════════════ STEP 1 ══════════════ */}
          {step === 1 && (
            <View style={s.section}>
              <Text style={s.stepBadge}>Step 1 of 3</Text>
              <Text style={s.title}>Your Current Physique</Text>
              <Text style={s.subtitle}>We personalize your plan using these body metrics.</Text>

              {/* Character card with 3D effect */}
              <View style={s.heroCardWrap}>
                <View style={s.heroCardShadow} />
                <View style={s.heroCard}>
                  <Image source={{ uri: characterImage }} style={s.heroImage} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(183,0,78,0.55)']}
                    style={s.heroOverlay}
                  />
                  <View style={s.heroBadge}>
                    <Zap size={14} color="#fff" />
                    <Text style={s.heroBadgeText}>Profile Active</Text>
                  </View>
                </View>
              </View>

              {/* Metrics */}
              <View style={s.metricsGrid}>
                <MetricStepper label="Weight" value={weightKg} unit="kg" min={35} max={120} onChange={setWeightKg} />
                <MetricStepper label="Height" value={heightCm} unit="cm" min={135} max={210} onChange={setHeightCm} />
              </View>

              {/* BMI card */}
              <View style={s.bmiCard}>
                <View style={s.bmiCardHighlight} />
                <View style={s.bmiLeft}>
                  <Text style={s.bmiLabel}>Body Mass Index</Text>
                  <Text style={s.bmiValue}>{bmi.toFixed(1)}</Text>
                </View>
                <View style={[s.bmiChip, { backgroundColor: bmiCategory.color + '22' }]}>
                  <View style={[s.bmiDot, { backgroundColor: bmiCategory.color }]} />
                  <Text style={[s.bmiChipText, { color: bmiCategory.color }]}>{bmiCategory.label}</Text>
                </View>
              </View>
            </View>
          )}

          {/* ══════════════ STEP 2 ══════════════ */}
          {step === 2 && (
            <View style={s.section}>
              <Text style={s.stepBadge}>Step 2 of 3</Text>
              <Text style={s.title}>Your Goal Physique</Text>
              <Text style={s.subtitle}>Choose a body direction, target weight, and age.</Text>

              {/* 3-D carousel card */}
              <View style={s.carouselWrap}>
                <TouchableOpacity
                  style={s.arrowBtn}
                  onPress={() => setBodyIndex((p) => (p - 1 + variants.length) % variants.length)}
                  activeOpacity={0.8}
                >
                  <LinearGradient colors={['#fc695d', '#b7004e']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                  <ChevronLeft size={20} color="#fff" />
                </TouchableOpacity>

                <View style={s.carouselCardWrap}>
                  <View style={s.carouselShadow} />
                  <View style={s.carouselCard}>
                    <Image source={{ uri: characterImage }} style={s.carouselImage} resizeMode="cover" />
                    <LinearGradient colors={['transparent', 'rgba(183,0,78,0.5)']} style={s.heroOverlay} />
                  </View>
                </View>

                <TouchableOpacity
                  style={s.arrowBtn}
                  onPress={() => setBodyIndex((p) => (p + 1) % variants.length)}
                  activeOpacity={0.8}
                >
                  <LinearGradient colors={['#fc695d', '#b7004e']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                  <ChevronRight size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <CarouselDots count={variants.length} activeIndex={bodyIndex} />

              <View style={s.metricsGrid}>
                <MetricStepper label="Target Weight" value={desiredWeightKg} unit="kg" min={35} max={100} onChange={setDesiredWeightKg} />
                <MetricStepper label="Age" value={age} unit="yrs" min={16} max={60} onChange={setAge} />
              </View>
            </View>
          )}

          {/* ══════════════ STEP 3 ══════════════ */}
          {step === 3 && (
            <View style={s.section}>
              <Text style={s.stepBadge}>Step 3 of 3</Text>
              <Text style={s.title}>Building Your Plan</Text>
              <Text style={s.subtitle}>Our AI is crafting the perfect Luna journey for you.</Text>

              <AiRing progress={aiProgress} />

              {/* Insight card */}
              <View style={s.insightCard}>
                <View style={s.insightCardHighlight} />
                <LinearGradient
                  colors={['rgba(183,0,78,0.08)', 'rgba(252,105,93,0.04)']}
                  style={StyleSheet.absoluteFillObject}
                  borderRadius={Radius.xl}
                />
                <View style={s.insightHeader}>
                  <LinearGradient colors={['#fc695d', '#b7004e']} style={s.insightIconBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Sparkles size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={s.insightTitle}>AI Profile Evaluation</Text>
                </View>
                <Text style={s.insightBody}>
                  Combining your goals, body metrics, and gender-specific recommendations into one personalized plan.
                </Text>
                <View style={s.chipRow}>
                  {[
                    { icon: <HeartPulse size={14} color="#fff" />, label: 'Health' },
                    { icon: <Utensils size={14} color="#fff" />, label: 'Nutrition' },
                    { icon: <Dumbbell size={14} color="#fff" />, label: 'Fitness' },
                  ].map(({ icon, label }) => (
                    <View key={label} style={s.chip}>
                      <LinearGradient colors={['#fc695d', '#b7004e']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                      {icon}
                      <Text style={s.chipText}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* ══════════════ STEP 4 ══════════════ */}
          {step === 4 && (
            <View style={s.section}>
              <Text style={s.stepBadge}>Your Luna Plan ✨</Text>
              <Text style={s.title}>Plan Ready!</Text>
              <Text style={s.subtitle}>Here's your personalized wellness transformation.</Text>

              <WeightChart startWeight={weightKg} endWeight={desiredWeightKg} months={aiPlan?.timelineEstimate?.months ?? 3} />

              {/* Goal banner */}
              <View style={s.goalBanner}>
                <View style={s.goalBannerHighlight} />
                <LinearGradient
                  colors={['#b7004e', '#e21364']}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  borderRadius={Radius.xl}
                />
                <Zap size={20} color="rgba(255,255,255,0.7)" />
                <Text style={s.goalBannerText}>
                  {goalDelta > 0 ? `Lose ${Math.abs(goalDelta)} kg` : `Gain ${Math.abs(goalDelta)} kg`} in ~{aiPlan?.timelineEstimate?.months ?? 3} months
                </Text>
              </View>

              {/* Diet plan card */}
              <View style={s.planCard}>
                <View style={s.planCardHighlight} />
                <View style={s.planHeader}>
                  <View style={s.planIconCircle}>
                    <LinearGradient colors={['#ffd9df', '#ffc0cb']} style={StyleSheet.absoluteFillObject} borderRadius={20} />
                    <Utensils size={18} color="#b7004e" />
                  </View>
                  <Text style={s.planTitle}>Daily Diet Plan</Text>
                </View>

                <View style={s.calorieRow}>
                  <Text style={s.calorieValue}>{aiPlan?.calorieRange ?? '---'}</Text>
                  <Text style={s.calorieUnit}>kcal / day</Text>
                </View>

                <View style={s.divider} />

                <View style={s.macroGrid}>
                  {[
                    { label: 'Protein', value: aiPlan?.macroSplit?.protein ?? '-', color: '#b7004e' },
                    { label: 'Fiber', value: aiPlan?.macroSplit?.fiber ?? '-', color: '#2e7d32' },
                    { label: 'Carbs', value: aiPlan?.macroSplit?.carbs ?? '-', color: '#e21364' },
                    { label: 'Fat', value: aiPlan?.macroSplit?.fat ?? '-', color: '#fc695d' },
                  ].map(({ label, value, color }) => (
                    <View key={label} style={s.macroCard}>
                      <View style={s.macroCardHighlight} />
                      <View style={[s.macroDot, { backgroundColor: color }]} />
                      <Text style={s.macroValue}>{value}</Text>
                      <Text style={s.macroLabel}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* AI Insights Card */}
              {aiPlan && (
                <View style={[s.planCard, { marginTop: Spacing.md }]}>
                  <View style={s.insightHeader}>
                    <View style={[s.planIconCircle, { backgroundColor: '#ffd9df' }]}>
                      <Activity size={18} color="#b7004e" />
                    </View>
                    <Text style={s.planTitle}>Metabolic Profile</Text>
                  </View>
                  <Text style={[s.insightBody, { marginBottom: Spacing.md }]}>
                    {aiPlan.metabolicProfile}
                  </Text>
                  
                  {aiPlan.hormonalRiskSignals && aiPlan.hormonalRiskSignals.length > 0 && (
                    <>
                      <View style={s.divider} />
                      <View style={s.insightHeader}>
                        <AlertTriangle size={16} color="#fc695d" />
                        <Text style={[s.planTitle, { fontSize: Typography.base.fontSize }]}>Considerations</Text>
                      </View>
                      {aiPlan.hormonalRiskSignals.map((signal, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 }}>
                          <View style={[s.macroDot, { backgroundColor: '#fc695d', marginTop: 6, marginRight: 8 }]} />
                          <Text style={[s.insightBody, { flex: 1, fontSize: 13 }]}>{signal}</Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              )}
            </View>
          )}

        </Animated.View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Bottom CTA */}
      <View style={s.bottomBar}>
        <TouchableOpacity
          style={[s.ctaBtn, (step === 3 || saving) && s.ctaBtnDisabled]}
          onPress={handleNext}
          activeOpacity={0.88}
          disabled={step === 3 || saving}
        >
          <LinearGradient
            colors={['#fc695d', '#b7004e']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            borderRadius={Radius.full}
          />
          <Text style={s.ctaBtnText}>
            {step < 3 ? 'Continue' : saving ? 'Saving…' : "Let's Explore →"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#faf8ff' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffd9df',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerCenter: { alignItems: 'center' },
  headerLogo: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  headerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.rose,
    marginTop: 2,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: Spacing.lg,
  },
  progressBarWrap: { flex: 1, height: 5, borderRadius: Radius.full, overflow: 'hidden' },
  progressBarBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#ffd9df' },
  progressBarFill: { height: '100%', borderRadius: Radius.full },

  // Content
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  section: { gap: Spacing.md },
  stepBadge: {
    alignSelf: 'center',
    color: Colors.rose,
    fontSize: Typography.xs.fontSize,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    backgroundColor: '#ffd9df',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  title: {
    color: Colors.text,
    textAlign: 'center',
    fontSize: Typography['2xl'].fontSize,
    lineHeight: Typography['2xl'].lineHeight,
    fontWeight: FontWeight.extrabold,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeight.medium,
    marginTop: -6,
  },

  // Hero image card (3-D)
  heroCardWrap: { alignSelf: 'center', width: '100%' },
  heroCardShadow: {
    position: 'absolute',
    bottom: -10,
    left: 12,
    right: 12,
    height: 30,
    borderRadius: Radius.xl,
    backgroundColor: '#b7004e',
    opacity: 0.18,
    transform: [{ scaleX: 0.9 }],
  },
  heroCard: {
    width: '100%',
    height: 300,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#ffd9df',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
  },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  heroHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  heroBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(183,0,78,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  heroBadgeText: { color: '#fff', fontSize: Typography.xs.fontSize, fontWeight: FontWeight.bold },

  // Metrics
  metricsGrid: { flexDirection: 'row', gap: Spacing.sm },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#ffd9df',
    padding: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  metricHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(252,105,93,0.5)',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  metricLabel: {
    color: Colors.textMuted,
    fontSize: Typography.xs.fontSize,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  metricValue: {
    color: Colors.text,
    fontSize: Typography['2xl'].fontSize,
    fontWeight: FontWeight.extrabold,
  },
  metricUnit: {
    color: Colors.textMuted,
    fontSize: Typography.sm.fontSize,
    fontWeight: FontWeight.bold,
  },
  metricTrack: {
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: '#ffd9df',
    overflow: 'hidden',
    marginVertical: Spacing.sm,
  },
  metricFill: { height: '100%', borderRadius: Radius.full },
  metricControls: { flexDirection: 'row', gap: Spacing.sm },
  metricBtn: {
    flex: 1,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffd9df',
    borderWidth: 1,
    borderColor: '#ffc0cb',
    overflow: 'hidden',
  },
  metricBtnPlus: { backgroundColor: 'transparent', borderColor: 'transparent' },
  metricBtnText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: FontWeight.extrabold,
    lineHeight: 22,
  },

  // BMI card
  bmiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#ffd9df',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  bmiCardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(226,19,100,0.4)',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  bmiLeft: {},
  bmiLabel: { color: Colors.textMuted, fontSize: Typography.xs.fontSize, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 0.8 },
  bmiValue: { color: Colors.text, fontSize: Typography['3xl'].fontSize, fontWeight: FontWeight.extrabold, marginTop: 2 },
  bmiChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8 },
  bmiDot: { width: 8, height: 8, borderRadius: Radius.full },
  bmiChipText: { fontSize: Typography.sm.fontSize, fontWeight: FontWeight.bold },

  // Carousel (step 2)
  carouselWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  carouselCardWrap: { flex: 1 },
  carouselShadow: {
    position: 'absolute',
    bottom: -8,
    left: 10,
    right: 10,
    height: 24,
    borderRadius: Radius.xl,
    backgroundColor: '#b7004e',
    opacity: 0.18,
  },
  carouselCard: {
    width: '100%',
    height: 260,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#ffd9df',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 7,
  },
  carouselImage: { width: '100%', height: '100%' },

  // Dots
  dotRail: { flexDirection: 'row', alignSelf: 'center', gap: 6, padding: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffd9df' },
  dotActive: { width: 24, height: 8, borderRadius: 4, overflow: 'hidden' },

  // AI Ring
  ringWrap: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
  },
  ringBase: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 14,
    borderColor: '#ffd9df',
  },
  ringArc: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 14,
    borderColor: 'transparent',
    borderTopColor: Colors.rose,
    overflow: 'hidden',
  },
  ringCenter: { alignItems: 'center' },
  ringPct: { color: Colors.text, fontSize: Typography['2xl'].fontSize, fontWeight: FontWeight.extrabold },
  ringSubLabel: { color: Colors.textMuted, fontSize: Typography.xs.fontSize, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 0.8 },

  // Insight card
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#ffd9df',
    padding: Spacing.lg,
    overflow: 'hidden',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  insightCardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(183,0,78,0.5)',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  insightIconBg: { width: 36, height: 36, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  insightTitle: { color: Colors.text, fontSize: Typography.lg.fontSize, fontWeight: FontWeight.extrabold },
  insightBody: { color: Colors.textSecondary, fontSize: Typography.base.fontSize, lineHeight: Typography.base.lineHeight, fontWeight: FontWeight.medium },
  chipRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  chipText: { color: '#fff', fontSize: Typography.xs.fontSize, fontWeight: FontWeight.bold },

  // Chart (step 4)
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#ffd9df',
    paddingTop: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  chartHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(252,105,93,0.6)',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  chartFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    marginTop: 4,
  },
  chartLabel: { color: Colors.textSecondary, fontSize: Typography.sm.fontSize, fontWeight: FontWeight.bold },
  chartPill: { backgroundColor: '#ffd9df', paddingHorizontal: 14, paddingVertical: 5, borderRadius: Radius.full },
  chartPillText: { color: Colors.primary, fontSize: Typography.sm.fontSize, fontWeight: FontWeight.bold },

  // Goal banner
  goalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  goalBannerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  goalBannerText: { color: '#fff', fontSize: Typography.lg.fontSize, fontWeight: FontWeight.extrabold },

  // Plan card
  planCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#ffd9df',
    padding: Spacing.lg,
    overflow: 'hidden',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  planCardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(183,0,78,0.4)',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.md },
  planIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  planTitle: { color: Colors.text, fontSize: Typography.xl.fontSize, fontWeight: FontWeight.extrabold },
  calorieRow: { alignItems: 'center', paddingVertical: Spacing.sm },
  calorieValue: { color: Colors.primary, fontSize: Typography['3xl'].fontSize, fontWeight: FontWeight.extrabold },
  calorieUnit: { color: Colors.textMuted, fontSize: Typography.sm.fontSize, fontWeight: FontWeight.bold, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#ffd9df', marginVertical: Spacing.md },
  macroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  macroCard: {
    width: '48%',
    backgroundColor: '#faf8ff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#ffd9df',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    overflow: 'hidden',
  },
  macroCardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(183,0,78,0.25)',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  macroDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  macroValue: { color: Colors.text, fontSize: Typography.base.fontSize, fontWeight: FontWeight.extrabold },
  macroLabel: { color: Colors.textMuted, fontSize: Typography.xs.fontSize, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(250,248,255,0.9)',
  },
  ctaBtn: {
    height: 58,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaBtnDisabled: { opacity: 0.65 },
  ctaBtnText: { color: '#fff', fontSize: Typography.lg.fontSize, fontWeight: FontWeight.extrabold, letterSpacing: 0.3 },
});
