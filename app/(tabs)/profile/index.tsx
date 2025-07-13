import { userLogout } from '@/lib/auth';
import { clearToken } from '@/lib/authstorage';
import { auth, db } from '@/lib/firebase';
import { Link, router } from 'expo-router';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

 const screenWidth = Dimensions.get("window").width;
 const imagesize = (screenWidth-64-12*2)/3

export default function Profile() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<any[]>([]);

    useEffect(() => {
    if (!auth.currentUser) return;
    const fetchMyPosts = async () => {
      const q = query(
        collection(db, "post"),
        where("nickname", "==", auth.currentUser?.displayName)
      );
      const snap = await getDocs(q);
      setMyPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMyPosts();
  }, [loading]);

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
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>프로필</Text>
      <View style={styles.profileCard}>
        <TouchableOpacity activeOpacity={0.7}>
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
          placeholderTextColor="#9ca3af"
          onBlur={handleSaveNickname}
        />
        <Text style={styles.email}>{userEmail}</Text>
      </View>
  <View style={styles.activityCard}>
    <Text style={{fontSize:14,fontWeight:'800',textAlign:'center',marginBottom:10}}>내 게시글</Text>
       <FlatList
  data={myPosts.filter(p => !!p.imageUrl)}
  keyExtractor={item => item.id}
  numColumns={3}
  contentContainerStyle={{ alignItems: 'flex-start' }}
  renderItem={({ item }) => (
    <Link href={`/post/${item.id}`} asChild>
      <TouchableOpacity style={styles.gridItem}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
        />
      </TouchableOpacity>
    </Link>
  )}
  scrollEnabled={false}
  ListEmptyComponent={  <View style={{flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal:99}}>
    <Text style={{fontSize:16, color:'#9ca3af',paddingVertical:10}}>게시글이 없습니다.</Text>
  </View>}
/>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1,
  },
  title: {
    fontWeight: '800',
    fontSize: 32,
    marginTop: 40,
    color: '#1e40af',
    marginBottom: 24,
  },
  profileCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e5e7eb',
    marginBottom: 16,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    width: 180,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    color: '#111827',
  },
  email: {
    fontSize: 15,
    color: '#b7b6b6',
    marginBottom: 16,
    textAlign: 'center',
  },
  activityCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding:5,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    width: '90%',
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
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
  },
  gridItem: {
    width: imagesize,
    height: imagesize,
    margin: 2,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
