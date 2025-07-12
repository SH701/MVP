import { userSignup } from "@/lib/auth";
import { saveToken } from "@/lib/authstorage";
import { signupSchema } from "@/lib/schema";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Sign() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailerr, setEmailerr] = useState('');
  const [passworderr, setPassworderr] = useState('');
  const [confirmPassworderr, setConfirmPassworderr] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const result = signupSchema.safeParse({ email, password, confirmPassword });

 const handleSignup = async () => {
    console.log("safeParse result:", result);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      setEmailerr(fieldErrors.email?.[0] ?? '');
      setPassworderr(fieldErrors.password?.[0] ?? '');
      setConfirmPassworderr(fieldErrors.confirmPassword?.[0] ?? '');
      return;
    }
    setEmailerr('');
    setPassworderr('');
    setConfirmPassworderr('');
    setEmailerr('');
    setPassworderr('');
    setConfirmPassworderr('');
    if(isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const userCred = await userSignup({ email, password, });
      const token = await userCred.user.getIdToken();
      await saveToken(token);
      alert("회원가입 성공");
      router.replace('/profile')
    } catch (e: any) {
      console.log(e)
      alert("회원가입 실패: " + e.message);
    }finally{
        setIsLoggingIn(false)
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>회원가입</Text>

      <TextInput
        placeholder="이메일을 입력하세요."
        value={email}
        onChangeText={t => {
          setEmail(t);
          setEmailerr('');
        }}
        autoCapitalize="none"
        style={styles.input}
      />
      {emailerr ? <Text style={styles.error}>{emailerr}</Text> : null}

      <TextInput
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChangeText={t => {
          setPassword(t);
          setPassworderr('');
        }}
        autoCapitalize="none"
        secureTextEntry
        style={styles.input}
      />
      {passworderr ? <Text style={styles.error}>{passworderr}</Text> : null}

      <TextInput
        placeholder="비밀번호를 다시 입력하세요."
        value={confirmPassword}
        onChangeText={t => {
          setConfirmPassword(t);
          setConfirmPassworderr('');
        }}
        autoCapitalize="none"
        secureTextEntry
        style={styles.input}
      />
      {confirmPassworderr ? <Text style={styles.error}>{confirmPassworderr}</Text> : null}

      <TouchableOpacity style={[styles.button, isLoggingIn && styles.buttonDisabled]} onPress={handleSignup} disabled={isLoggingIn}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>

      <View style={styles.container2}>
        <Text style={{lineHeight:24}}>이미 계정이 있으신가요?</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.moveLogin}>로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonDisabled:{
    opacity:0.6
  },
  container2: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  moveLogin: {
    textDecorationLine: 'underline',
    fontSize: 16,
    lineHeight: 24,
    color: '#0a7ea4'
  },
});
