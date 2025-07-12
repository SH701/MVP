import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="post/index"
        options={{
          title: 'Post',
          tabBarLabel: 'Post',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size }}>📖</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
