import { userLogin } from "@/lib/auth";
import { saveToken } from "@/lib/authstorage";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

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
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholderTextColor="#9ca3af"
      />
      <TextInput
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry
        textContentType="password"
        placeholderTextColor="#9ca3af"
      />

      <TouchableOpacity
        style={[styles.button, isLoggingIn && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoggingIn}
        activeOpacity={0.8}
      >
        {isLoggingIn ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>로그인</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>계정이 없으신가요?</Text>
        <TouchableOpacity onPress={() => router.push("/sign")}>
          <Text style={styles.signUpText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1e40af",
    marginBottom: 40,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  input: {
    width: width * 0.8,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
    marginBottom: 20,
    color: "#111827",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  button: {
    width: width * 0.8,
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 8,
  },
  footerText: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },
  signUpText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#2563eb",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
