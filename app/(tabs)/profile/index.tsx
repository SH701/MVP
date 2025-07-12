import { userLogout } from '@/lib/auth';
import { clearToken } from '@/lib/authstorage';
import { auth } from '@/lib/firebase';
import { router } from 'expo-router';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function Profile() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        setUserEmail(user.email ?? '');
        setNickname(user.displayName ?? '');
        setPhoto(user.photoURL);
        setLoading(false);
      } else {
        router.replace('/login');
      }
    });
    return unsub;
  }, []);


  const handlePickPhoto = () => {
    alert('프로필 사진 선택 기능은 따로 구현 필요!');
  }
  const handleSaveNickname = async () => {
    try {
      if (auth.currentUser && nickname) {
        await updateProfile(auth.currentUser, { displayName: nickname });
        alert('닉네임이 저장되었습니다!');
      }
    } catch (e: any) {
      alert('닉네임 저장 오류: ' + e.message);
    }
  };
  const handleMyPosts = () => {
  router.push('/myposts');
};

const handleMyComments = () => {
  router.push('/mycomments');
};

  const handleLogout = async () => {
    try {
      await userLogout();
      await clearToken();
      router.replace('/login');
    } catch (e: any) {
      alert('로그아웃 중 오류가 발생했습니다: ' + e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <Text style={styles.title}>프로필</Text>
     <View style={styles.profileCard}>
  <TouchableOpacity onPress={handlePickPhoto}>
    <Image 
      source={photo ? { uri: photo } : require('@/assets/images/profile.png')}
      style={styles.avatar}
    />
  </TouchableOpacity>
  <TextInput
    style={styles.nickname}
    value={nickname}
    onChangeText={setNickname}
    placeholder="닉네임 입력"
    onBlur={handleSaveNickname}
  />
  <Text style={styles.email}>{userEmail}</Text>
</View>
    <View style={styles.activityCard}>
  <View style={styles.activityButtons}>
    <TouchableOpacity style={styles.activityButton} onPress={handleMyPosts}>
      <Text style={styles.activityButtonText}>📖 내가 쓴 글</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.activityButton} onPress={handleMyComments}>
      <Text style={styles.activityButtonText}>✏️ 내가 쓴 댓글</Text>
    </TouchableOpacity>
  </View>
</View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  title:{
    fontWeight:'800',
    fontSize:32,
    marginTop:40,
  },
  profileCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 64,
    marginBottom: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,

    width: 180,
    paddingVertical: 4,
  },
  email: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  activityCard: {
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 18,
  marginBottom: 28,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.10,
  shadowRadius: 6,
  elevation: 2,
  alignItems: 'center',
},
activityTitle: {
  fontSize: 17,
  fontWeight: 'bold',
  marginBottom: 10,
  color: '#222',
},
activityButtons: {
  flexDirection: 'row',
  gap: 12,
},
activityButton: {
  backgroundColor: '#F3F4F8',
  paddingVertical: 10,
  paddingHorizontal: 22,
  borderRadius: 8,
  marginHorizontal: 4,
},
activityButtonText: {
  fontSize: 15,
  color: '#222',
},
  button: {
    width:'90%',
    backgroundColor: '#FF3B30',
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
