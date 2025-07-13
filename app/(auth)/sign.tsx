import { userSignup } from "@/lib/auth";
import { saveToken } from "@/lib/authstorage";
import { signupSchema } from "@/lib/schema";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Sign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailerr, setEmailerr] = useState("");
  const [passworderr, setPassworderr] = useState("");
  const [confirmPassworderr, setConfirmPassworderr] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const result = signupSchema.safeParse({ email, password, confirmPassword });

  const handleSignup = async () => {
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setEmailerr(fieldErrors.email?.[0] ?? "");
      setPassworderr(fieldErrors.password?.[0] ?? "");
      setConfirmPassworderr(fieldErrors.confirmPassword?.[0] ?? "");
      return;
    }
    setEmailerr("");
    setPassworderr("");
    setConfirmPassworderr("");
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const userCred = await userSignup({ email, password });
      const token = await userCred.user.getIdToken();
      await saveToken(token);
      alert("회원가입 성공");
      router.replace("/profile");
    } catch (e: any) {
      console.log(e);
      alert("회원가입 실패: " + e.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>회원가입</Text>

      <TextInput
        placeholder="이메일을 입력하세요."
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setEmailerr("");
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholderTextColor="#9ca3af"
        style={[styles.input, emailerr && styles.inputError]}
      />
      {emailerr ? <Text style={styles.error}>{emailerr}</Text> : null}

      <TextInput
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          setPassworderr("");
        }}
        autoCapitalize="none"
        secureTextEntry
        textContentType="password"
        placeholderTextColor="#9ca3af"
        style={[styles.input, passworderr && styles.inputError]}
      />
      {passworderr ? <Text style={styles.error}>{passworderr}</Text> : null}

      <TextInput
        placeholder="비밀번호를 다시 입력하세요."
        value={confirmPassword}
        onChangeText={(t) => {
          setConfirmPassword(t);
          setConfirmPassworderr("");
        }}
        autoCapitalize="none"
        secureTextEntry
        placeholderTextColor="#9ca3af"
        style={[styles.input, confirmPassworderr && styles.inputError]}
      />
      {confirmPassworderr ? <Text style={styles.error}>{confirmPassworderr}</Text> : null}

      <TouchableOpacity
        style={[styles.button, isLoggingIn && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={isLoggingIn}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.signUpText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 50,
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
    width: width * 0.85,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
    marginBottom: 8,
    color: "#111827",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: width * 0.075,
    marginBottom: 10,
  },
  button: {
    width: width * 0.85,
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    marginTop: 20,
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
