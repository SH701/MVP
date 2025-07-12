import { db } from '@/lib/firebase';
import { useLocalSearchParams } from 'expo-router';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PostDetail() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;
    const fetchComments = async () => {
      const q = query(
        collection(db, `post/${postId}/comments`),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      setComments(
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    await addDoc(collection(db, `post/${postId}/comments`), {
      content: comment,
      user: "익명",
      createdAt: serverTimestamp(),
    });
    setComment('');

    const q = query(
      collection(db, `post/${postId}/comments`),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    setComments(
      snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    );
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>댓글</Text>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <Text style={styles.commentUser}>{item.user}</Text>
            <Text style={styles.commentText}>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="댓글을 입력하세요"
          value={comment}
          onChangeText={setComment}
        />
        <Button title="등록" onPress={handleAddComment} disabled={loading || !comment.trim()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  commentCard: {
    padding: 10,
    backgroundColor: '#f4f4f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  commentUser: { fontWeight: 'bold', color: '#555' },
  commentText: { marginTop: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  input: {
    flex: 1,
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8, marginRight: 8,
  },
});
