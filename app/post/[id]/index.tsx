import { formatTime } from '@/components/formattime';
import { auth, db } from '@/lib/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface PostType {
  videoUrl: string;
  imageUrl: any;
  content: string;
  id: string;
  nickname: string;
}

export default function PostDetail() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      const docRef = doc(db, 'post', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost(docSnap.data() as PostType);
      }
    };
    const fetchComments = async () => {
      const q = query(collection(db, `post/${postId}/comments`), orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchPost();
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);

    await addDoc(collection(db, `post/${postId}/comments`), {
      content: comment,
      user: auth.currentUser?.displayName,
      createdAt: serverTimestamp(),
    });

    setComment('');
    const q = query(collection(db, `post/${postId}/comments`), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    flatListRef.current?.scrollToEnd({ animated: true });
    setLoading(false);
  };

  const deletePost = () => {
    Alert.alert(
      '게시물 삭제',
      '정말 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'post', postId));
              alert('게시물이 삭제되었습니다');
              router.push('/feed');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              alert('게시물 삭제 실패');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const deleteComment = (commentId: string) => {
    Alert.alert(
      '댓글 삭제',
      '정말 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, `post/${postId}/comments`, commentId));
              setComments(prev => prev.filter(c => c.id !== commentId));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              alert('댓글 삭제 실패');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const renderPostHeader = () => {
    if (!post) return null;
    return (
      <View style={styles.postContainer}>
        {post.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.postHeader}>
          <View style={styles.postInfo}>
            <Text style={styles.nickname}>{post.nickname}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>
          {post.nickname === auth.currentUser?.displayName && (
            <TouchableOpacity onPress={deletePost} style={styles.deletePostButton}>
              <Text style={styles.deleteText}>삭제</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={{color:'#9ca3af', fontSize:12, marginLeft:8, marginBottom:8,paddingHorizontal:6}}>
          {formatTime((post as any).createdAt)}
        </Text>
      </View>
    );
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <FlatList
        ref={flatListRef}
        ListHeaderComponent={renderPostHeader}
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>{item.user}</Text>
              {(post?.nickname === auth.currentUser?.displayName || item.user === auth.currentUser?.displayName) && (
                <TouchableOpacity onPress={() => deleteComment(item.id)}>
                  <Text style={styles.deleteCommentText}>삭제</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.commentText}>{item.content}</Text>
            <Text style={{color:'#9ca3af', fontSize:10, marginTop:4}}>
              {formatTime(item.createdAt)}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
        <View style={{alignItems:'center', padding:32}}>
          <Text style={{color:'#9ca3af', fontSize:16}}>댓글이 아직 없습니다.</Text>
        </View>
        )}  
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100, backgroundColor: '#f9fafb' }}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginTop:70,
    paddingHorizontal:10
  },
  image: {
    width: '100%',
    height: 400,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  postInfo: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  nickname: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1e40af',
  },
  postContent: {
    fontSize: 16,
    color: '#374151',
    flexShrink: 1,
  },
  deletePostButton: {
    justifyContent: 'center',
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    paddingLeft: 8,
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginHorizontal: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: '700',
    color: '#1e40af',
  },
  deleteCommentText: {
    color: '#ef4444',
    fontSize: 12,
  },
  commentText: {
    fontSize: 15,
    color: '#374151',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginBottom:40,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
});
