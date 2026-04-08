import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#b7004e',
        tabBarInactiveTintColor: '#8f6f74',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e4bdc3',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <SymbolView name="house" tintColor={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="fitness"
        options={{
          title: 'Fitness',
          tabBarIcon: ({ color }) => <SymbolView name="figure.run" tintColor={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
          tabBarIcon: ({ color }) => <SymbolView name="leaf" tintColor={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <SymbolView name="person.2" tintColor={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <SymbolView name="person" tintColor={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
