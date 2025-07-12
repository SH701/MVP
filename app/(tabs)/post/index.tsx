import { db } from "@/lib/firebase";
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Link, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostType{
    videoUrl: string;
    imageUrl: any;
    title:string;
    content:string;
    id:string;
}

export default function Post() {
  const router = useRouter();
  const [posts,setPosts] = useState<PostType[]>([]);
 useEffect(() => {
  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "post"));
    const data = querySnapshot.docs.map(doc => {
      const d = doc.data() as PostType;
      const { id, ...rest } = d;
      return { id: doc.id, ...rest };
    });
    setPosts(data);
  };
  fetchPosts();
}, []);

   return (
    <View style={styles.container}>
      <FlatList
  data={posts}
  keyExtractor={item => item.id}
  renderItem={({ item }) => (
    <View style={styles.card}>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: '100%', height: 200, borderRadius: 6, marginBottom: 12 }}
          resizeMode="cover"
        />
      )}
      {item.videoUrl && (
        <Video
          source={{ uri: item.videoUrl }}
          style={{ width: '100%', height: 200, borderRadius: 6, marginBottom: 12 }}
          useNativeControls
           resizeMode={"cover" as any}
          isLooping
        />
      )}
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text>{item.content}</Text>
      <Link href={`/post/${item.id}` as any}>
        <Text>글 상세보기</Text>
      </Link>
    </View>
  )}
/>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/createpost')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,marginTop:70},
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  link: {
    marginTop: 8,
    color: '#2196F3',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});