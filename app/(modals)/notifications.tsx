import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const NOTIFICATIONS = [
  { id: '1', title: 'Workout Reminder 💪', body: 'Time for your Full Body Strength session!', time: '2 min ago', unread: true },
  { id: '2', title: 'Daily Goal Achieved 🎉', body: 'You\'ve hit your 2,000 step goal today.', time: '1 hr ago', unread: true },
  { id: '3', title: 'New Community Post', body: 'Priya K. shared a new wellness tip.', time: '3 hrs ago', unread: false },
  { id: '4', title: 'Diet Check-in 🥗', body: 'Don\'t forget to log your lunch.', time: 'Yesterday', unread: false },
  { id: '5', title: 'Consultation Tomorrow', body: 'Dr. Ananya Sharma at 4:00 PM.', time: 'Yesterday', unread: false },
];

export default function NotificationsScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-6 pt-14 pb-6 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Notifications 🔔</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-purple-600 font-medium">Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 mt-2">
        {NOTIFICATIONS.map((n) => (
          <View
            key={n.id}
            className={`flex-row py-4 border-b border-gray-50 ${n.unread ? 'opacity-100' : 'opacity-60'}`}
          >
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-gray-900 text-sm">{n.title}</Text>
                {n.unread && <View className="w-2 h-2 rounded-full bg-purple-600" />}
              </View>
              <Text className="text-gray-500 text-sm mt-0.5">{n.body}</Text>
              <Text className="text-gray-300 text-xs mt-1">{n.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
