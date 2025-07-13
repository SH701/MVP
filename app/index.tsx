import { loadToken } from '@/lib/authstorage';
import { auth } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    let handled = false;
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user && !handled) {
        handled = true;
        setLoading(false);
      }
    });

    loadToken()
      .then(tok => {
        if (tok && !handled) {
          handled = true;
          setLoading(false);
        }
      })
      .finally(() => {
        if (!handled) setLoading(false);
      });

    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.title}>커뮤니티 앱</Text>
      <TouchableOpacity
        style={[styles.button, styles.signupButton]}
        activeOpacity={0.8}
        onPress={() => router.push('/sign')}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        activeOpacity={0.8}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>© 2025 My Community App</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 50,
    color: '#1e40af',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  button: {
    width: width * 0.8,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#2563eb',
  },
  loginButton: {
    backgroundColor: '#1e40af',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 20,
  },
  footerText: {
    marginTop: 40,
    fontSize: 12,
    color: '#94a3b8',
  },
});
