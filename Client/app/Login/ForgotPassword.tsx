import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Thông báo", "Vui lòng nhập email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.6:8080/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        Alert.alert("Lỗi", errorText);
        return;
      }

      Alert.alert("Thành công", "Đã gửi OTP về email. Vui lòng kiểm tra hộp thư.");
      setStep(2);
    } catch (err) {
      console.error("❌ Lỗi:", err);
      Alert.alert("Lỗi", "Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://192.168.0.119:8080/api/users/verify-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        Alert.alert("Lỗi", errorText);
        return;
      }

      Alert.alert("Thành công", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      router.replace("/Login/LoginScreen");
    } catch (err) {
      console.error("❌ Lỗi:", err);
      Alert.alert("Lỗi", "Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
        >
          <View style={styles.formWrapper}>
            <Text style={styles.title}>Quên mật khẩu</Text>

            <View style={styles.form}>
              {step === 1 ? (
                <>
                  <Text style={styles.label}>Nhập Email :</Text>
                  <TextInput
                    placeholder="example@gmail.com"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSendOtp}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Đang gửi..." : "Gửi OTP"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.label}>Nhập OTP</Text>
                  <TextInput
                    placeholder="OTP"
                    placeholderTextColor="#888"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <Text style={styles.label}>Nhập mật khẩu mới</Text>
                  <TextInput
                    placeholder="Mật khẩu mới"
                    placeholderTextColor="#888"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleResetPassword}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  formWrapper: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 16, // ✅ to hơn
    fontWeight: "400", // ✅ đậm
    color: "#000",
    marginBottom: 8,
  },
  form: {},
  input: {
    backgroundColor: "#fff", // ✅ input nền trắng
    color: "#000", // ✅ chữ đen
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
