import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';

const SUPABASE_URL = 'https://awojnjixinygekwrtptn.supabase.co';
const SUPABASE_KEY = 'Sb_publishable__nKVS2umplsCOxHv_b1uYg_knfNPLd1';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Naya Account Banane aur Direct Login karne ka Code
  const signUp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return Alert.alert("Error", "Email aur Password dono daalna zaroori hai!");

    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await response.json();

      if (data.error) {
         Alert.alert("Signup Error ❌", data.error_description || data.msg || "Account nahi ban paya.");
      } else {
         // Success hote hi Automatic Login!
         Alert.alert("Success! 🎉", "Aapka account ban gaya hai aur login ho gaya hai!");
         setUser(data.user || { email: cleanEmail }); 
      }
    } catch (error) {
      Alert.alert("Internet Error", "Network problem hai.");
    } finally {
      setLoading(false);
    }
  };

  // Purane Account se Login karne ka Code
  const signIn = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return Alert.alert("Error", "Email aur password daaliye!");

    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await response.json();

      if (data.error) {
        Alert.alert("Login Failed ❌", data.error_description || data.msg || "Email ya password galat hai!");
      } else if (data.access_token || data.user) {
        // 100% Guaranteed Login Success
        setUser(data.user || { email: cleanEmail });
      } else {
        Alert.alert("Developer Message", JSON.stringify(data));
      }
    } catch (error) {
      Alert.alert("Internet Error", "Network problem hai.");
    } finally {
      setLoading(false);
    }
  };

  // Login Screen UI
  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.logo}>CP</Text>
        <Text style={styles.title}>Creators Pulse</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#ff7a00" style={{ marginTop: 20 }} />
          ) : (
            <>
              <TouchableOpacity style={styles.loginBtn} onPress={signIn}>
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signupBtn} onPress={signUp}>
                <Text style={styles.signupText}>Create New Account</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  // Dashboard Screen UI
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.emailText}>{user.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.balanceTitle}>Wallet Balance</Text>
        <Text style={styles.balanceAmt}>₹0.00</Text>
        <TouchableOpacity style={styles.withdrawBtn} onPress={() => Alert.alert("KYC Pending", "Paise nikalne ke liye pehle apni KYC complete karein.")}>
          <Text style={styles.withdrawText}>Withdraw / KYC</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridBox}>
          <Text style={styles.boxTitle}>AI Video Studio</Text>
          <Text style={styles.boxSub}>Generate Content</Text>
        </View>
        <View style={styles.gridBox}>
          <Text style={styles.boxTitle}>Brand Collabs</Text>
          <Text style={styles.boxSub}>Find Sponsors</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => setUser(null)}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0c29', padding: 20, justifyContent: 'center' },
  logo: { fontSize: 60, fontWeight: 'bold', color: '#a100ff', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 40 },
  form: { backgroundColor: '#1e1b4b', padding: 20, borderRadius: 15 },
  input: { backgroundColor: '#312e81', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  loginBtn: { backgroundColor: '#ff7a00', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signupBtn: { padding: 15, alignItems: 'center', marginTop: 15 },
  signupText: { color: '#a100ff', fontWeight: 'bold', fontSize: 16 },
  header: { marginTop: 40, marginBottom: 30 },
  welcomeText: { color: '#999', fontSize: 18 },
  emailText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#1e1b4b', padding: 25, borderRadius: 15, alignItems: 'center', marginBottom: 30 },
  balanceTitle: { color: '#999', fontSize: 16, marginBottom: 10 },
  balanceAmt: { color: '#4ade80', fontSize: 36, fontWeight: 'bold', marginBottom: 20 },
  withdrawBtn: { backgroundColor: '#a100ff', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  withdrawText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  gridBox: { backgroundColor: '#312e81', width: '48%', padding: 20, borderRadius: 15, alignItems: 'center' },
  boxTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 5, textAlign: 'center' },
  boxSub: { color: '#999', fontSize: 12, textAlign: 'center' },
  logoutBtn: { marginTop: 'auto', padding: 15, alignItems: 'center' },
  logoutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 }
});
    
