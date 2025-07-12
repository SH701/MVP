import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const handleSubmit = async () => {
    if(!title.trim()||!content.trim()){
        Alert.alert('입력 오류','제목과 내용을 모두 입력해주세요')
        return;
    }
    try{
        setUploading(true);
        const formData = new FormData();
        formData.append('title',title)
        formData.append('content',content)
        if(imageUri){
             const uriParts = imageUri.split('.');
             const fileType = uriParts[uriParts.length-1];
             formData.append('image',{
                uri:imageUri,
                name:`photo.${fileType}`,
                type: `image/${fileType}`,
             }as any)
        }
        const res = await fetch("http://192.168.0.23:3000/api/post",{
            method:"POST",
            headers:{
               'Content-Type': 'multipart/form-data',
            },
            body:formData,
        });
        if(!res.ok){
            throw new Error(`서버 에러:${res.status}`)
        } 
        const result = await res.json();
        Alert.alert('성공', '포스트가 등록되었습니다!');
      router.push('/post');
    } catch (error: any) {
      console.error(error);
      Alert.alert('업로드 실패', error.message || '다시 시도해주세요.');
    } finally {
      setUploading(false);
    }
  };

   return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="제목을 입력하세요"
        value={title}
        onChangeText={setTitle}
      />
       {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
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
     

      <Button
        title={uploading ? '등록 중...' : '등록하기'}
        onPress={handleSubmit}
        disabled={uploading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16,marginTop:80 },
  titleInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    paddingBottom:7,
    marginBottom: 12,
  },
  contentInput: {
    fontSize: 16,
    height: 50,
    textAlignVertical: 'top',
    borderWidth: 1,
    padding: 8,
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
});
