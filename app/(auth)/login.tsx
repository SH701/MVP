import { userLogin } from "@/lib/auth";
import { saveToken } from "@/lib/authstorage";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const userCred = await userLogin({ email, password });
      const token = await userCred.user.getIdToken();
      await saveToken(token);
      alert("로그인 성공");
      router.replace("/profile");
    } catch (e: any) {
      alert("로그인 실패: " + e.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>로그인</Text>

      <TextInput
        placeholder="이메일을 입력하세요."
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry
      />

      <TouchableOpacity
        style={[
          styles.button,
          isLoggingIn && styles.buttonDisabled
        ]}
        onPress={handleLogin}
        disabled={isLoggingIn}
      >
        {isLoggingIn
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>로그인</Text>
        }
      </TouchableOpacity>

      <View style={styles.container2}>
        <Text style={{ lineHeight: 24 }}>계정이 없으신가요?</Text>
        <TouchableOpacity onPress={() => router.push("/sign")}>
          <Text style={styles.moveLogin}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16, paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  container2: {
    flexDirection: "row",
    gap: 8,
  },
  moveLogin: {
    textDecorationLine: "underline",
    fontSize: 16,
    lineHeight: 24,
    color: "#0a7ea4",
  },
});
