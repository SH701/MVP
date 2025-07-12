import { auth } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.replace('/login');
      }
    });
    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 로그인 안 된 상태인데 혹시 children 렌더링되는 경우 방지
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
