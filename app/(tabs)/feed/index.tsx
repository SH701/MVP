import { formatTime } from "@/components/formattime";
import { db } from "@/lib/firebase";
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Link, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/EvilIcons";

interface PostType {
  createdAt:any;
  videoUrl: string;
  imageUrl: any;
  content: string;
  id: string;
  nickname: string;
}

export default function Post() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);

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
        key={1}
        data={posts}
        numColumns={1}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flexDirection:'row',}}>
           <Image
              source={require('@/assets/images/profile.png')}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.topname}>{item.nickname}</Text>
              <Text style={{paddingHorizontal:0,paddingTop:5}}>{formatTime(item.createdAt)}</Text>
          </View>
          </View>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.media}
                resizeMode="cover"
              />
            )}
            {item.videoUrl && (
              <Video
                source={{ uri: item.videoUrl }}
                style={styles.media}
                useNativeControls
                resizeMode={"cover" as any}
                isLooping
              />
            )}
            <View style={styles.contentRow}>
              <Text style={styles.nickname}>{item.nickname}</Text>
              <Text style={styles.content}>{item.content}</Text>
            </View>
            <Link href={`/post/${item.id}` as any}>
              <TouchableOpacity style={styles.commentButton} activeOpacity={0.7}>
                <Icon name="comment" size={28} color="#2563eb" />
                <Text style={styles.commentText}>댓글</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/post/createpost')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    marginTop: 70, 
    backgroundColor: '#f9fafb',
  },
    avatar: {
    width: 40,
    height: 40,
    borderRadius: 48,
    backgroundColor: '#e5e7eb',
    margin: 10,
  },
  topname:{
    fontWeight: '700',
    fontSize: 16,
    color: '#1e3a8a',
    paddingTop:10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginHorizontal: 12,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    paddingBottom: 12,
  },
  media: {
    width: '100%',
    height: 400,
  },
  contentRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom:8,
    gap: 8,
    alignItems: 'center',
  },
  nickname: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1e3a8a',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingBottom:5,
  },
  commentText: {
    marginLeft: 8,
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 30,
    backgroundColor: '#2563eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
});
