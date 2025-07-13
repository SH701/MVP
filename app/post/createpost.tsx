import { auth, db, firebaseStorage } from '@/lib/firebase';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [videoUri,setVideoUri] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
  });
  if (!result.canceled) setImageUri(result.assets[0].uri);
};

  const pickVideo = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos, 
    quality: 1,
  });
  if (!result.canceled) setVideoUri(result.assets[0].uri);
};
  
  const uploadFile = async (uri:any,pathPrefix='uploads')=>{
    const filename = uri.split('/').pop();
    const res = await fetch(uri);
    const blob = await res.blob();
    const storageRef = ref(firebaseStorage,`${pathPrefix}/${filename}`)
    await uploadBytes(storageRef,blob);
    const url = await getDownloadURL(storageRef);
    return url
  }
  const handleSubmit = async()=>{
    try{
      if(!imageUri){
        Alert.alert('사진 첨부 필수', '게시글 등록 시 사진은 꼭 첨부해야 합니다.');
        return;
      }
      setUploading(true);
      let imageUrl = null;
      let videoUrl = null;
      if(imageUri){
        imageUrl= await uploadFile(imageUri,'images')
      }
      if(videoUri){
        videoUrl = await uploadFile(videoUri,'videos')
      }
      await addDoc(collection(db,"post"),{
        nickname:auth.currentUser?.displayName,
        content,
        imageUrl,
        videoUrl,
        createdAt: serverTimestamp(),
      })
       Alert.alert('성공', '포스트가 등록되었습니다!');
    router.push('/feed');
  } catch (error: any) {
    console.error(error);
    Alert.alert('업로드 실패', error.message || '다시 시도해주세요.');
  } finally {
    setUploading(false);
  }
};

   return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView contentContainerStyle={styles.container}
    >
        <View style={styles.previewBox}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.mediaPreview} />
      ) : videoUri ? (
        <Video
          source={{ uri: videoUri }}
           resizeMode={"cover" as any}
          useNativeControls
          style={styles.mediaPreview}
        />
      ) : (
        <Icon name="photo" size={30} color="#5a5858"  style={{ transform: [{ rotate: '-20deg' }] }}/>
      )}
    </View>
      <TextInput
        style={styles.contentInput}
        placeholder="내용을 입력하세요"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {imageUri ? '사진 변경' : '사진 첨부'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.imageButton} onPress={pickVideo}>
        <Text style={styles.imageButtonText}>
          {videoUri ? '영상 변경' : '영상 첨부'}
        </Text>
      </TouchableOpacity>
     

      <Button
        title={uploading ? '등록 중...' : '등록하기'}
        onPress={handleSubmit}
        disabled={uploading}
      />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16,marginTop:80 },
  titleInput: {
    fontSize: 18,
    borderWidth: 1,
    paddingVertical:7,
    marginBottom: 12,
    paddingHorizontal:8
  },
  contentInput: {
    fontSize: 16,
    height: 35,
    textAlignVertical: 'top',
    borderWidth: 1,
    paddingVertical:7,
    paddingHorizontal:8,
    borderRadius: 4,
    marginBottom: 12,
  },
  imageButton: {
    padding: 12,
    backgroundColor: '#e6e6e6',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  imageButtonText: { color: '#333' },
  preview: { width: '100%', height: 200, borderRadius: 6, marginBottom: 12 },
  previewBox: {
  width: '100%',
  aspectRatio: 1,
  borderWidth: 1,
  borderColor: '#eee',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fafafa',
  marginBottom: 16,
},
mediaPreview: {
  width: '100%',
  height: '100%',
  borderRadius: 10,
},
noPreviewText: {
  color: '#aaa',
  fontSize: 16,
},
});
