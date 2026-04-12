import React, { useEffect, useState, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { WifiOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
}

export function NetworkGuard({ children }: Props) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const slideAnim = React.useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Subscribe to network connectivity changes
    const unsubscribe = NetInfo.addEventListener(state => {
      // Treat null as connected internally to prevent false positive banners
      const currentlyConnected = state.isConnected ?? true;
      setIsConnected(currentlyConnected);

      // Gracefully animate banner in and out
      Animated.spring(slideAnim, {
        toValue: currentlyConnected ? -100 : Math.max(insets.top, 40) + 10,
        useNativeDriver: true,
        speed: 14,
        bounciness: 6,
      }).start();
    });

    return () => unsubscribe();
  }, [slideAnim, insets.top]);

  return (
    <View style={styles.container}>
      {children}
      
      {/* Floating Network Banner */}
      <Animated.View 
        style={[
          styles.banner, 
          { transform: [{ translateY: slideAnim }] }
        ]}
        pointerEvents="none" 
      >
        <WifiOff size={18} color="#ffffff" />
        <Text style={styles.text}>No internet connection</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    position: 'absolute',
    top: 0, 
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#b7004e', // Luna Primary
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 9999, // Guarantee it renders over absolutely everything
  },
  text: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  }
});
