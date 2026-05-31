import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';

// Aapke Supabase Database ki Chabiyan
const SUPABASE_URL = 'https://awojnjixinygekwrtptn.supabase.co';
const SUPABASE_KEY = 'Sb_publishable__nKVS2umplsCOxHv_b1uYg_knfNPLd1';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Naya Account Banane Ka Code
  const signUp = async () => {
    if (!email || !password) return Alert.alert("Error", "Bhai, Email aur Password dono daalna zaroori hai!");
    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error_description || data.msg || "Signup fail ho gaya.");
      Alert.alert("Success! 🎉", "Aapka account ban gaya hai! Ab 'Log In' button par click karein.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  // Login Karne Ka Code
  const signIn = async () => {
    if (!email || !password) return Alert.alert("Error", "Email aur password daaliye!");
    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.error) throw new Error("Email ya password galat hai.");
      setUser(data.user); // Login hone par user data save karega
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
    setLoading(false);
  };

  // Agar user Login NAHI hai, toh ye wala page dikhega (Login Screen)
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

  // Agar user Login HO GAYA hai, toh usko asli Dashboard dikhega
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

// App ki Design (Colors aur look)
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
  
  // Dashboard Styles
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
