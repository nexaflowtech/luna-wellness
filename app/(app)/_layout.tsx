import { Tabs } from 'expo-router';
import { Home, Dumbbell, UtensilsCrossed, TrendingUp, Users } from 'lucide-react-native';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6b21a8',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          height: 64,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="(workout)"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="(diet)"
        options={{
          title: 'Diet',
          tabBarIcon: ({ color, size }) => <UtensilsCrossed color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="(progress)"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="(community)"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
