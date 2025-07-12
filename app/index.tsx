import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { loadToken } from '@/lib/authstorage';
import { auth } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
}, []);
  useEffect(() => {
    let handled = false;
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user && !handled) {
        handled = true;
         setLoading(false);
      }
    });
    

    loadToken().then(tok => {
      if (tok && !handled) {
        handled = true;
         setLoading(false);
      }
    }).finally(() => {
      if (!handled) setLoading(false); 
    });

    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <ThemedView style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{flex:1,justifyContent:'center',alignItems:'center',gap:16}}>
      <ThemedText style={{fontSize:24,fontWeight:'bold'}}>커뮤니티 앱</ThemedText>
      <TouchableOpacity onPress={() => router.push('/sign')}>
        <ThemedText>회원가입</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <ThemedText>로그인</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
