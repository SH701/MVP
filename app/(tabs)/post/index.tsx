import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostType{
    title:string;
    content:string;
    id:string;
}

export default function Post() {
  const router = useRouter();
  const [posts,setPosts] = useState<PostType[]>([]);
  useEffect(()=>{
    setPosts([
        { id: '1', title: 'First Post', content: 'Hello World!' },
      { id: '2', title: 'Second Post', content: 'Expo Router Rocks' },
    ])
  },[])

   return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
            {/* <TouchableOpacity onPress={() => router.push(`/post?id=${item.id}`)}>
              <Text style={styles.link}>View</Text>
            </TouchableOpacity> */}
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