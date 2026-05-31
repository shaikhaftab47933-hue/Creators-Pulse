  import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar, Modal, SafeAreaView } from 'react-native';

const SUPABASE_URL = 'https://awojnjixinygekwrtptn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2puaml4aW55Z2Vrd3J0cHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjg3NjEsImV4cCI6MjA5NTcwNDc2MX0.GvpY43NvtBWWutYNW8luOweP-LEcr42N-iN4EiqR040';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('Home'); 
  const [menuOpen, setMenuOpen] = useState(false); 

  const signUp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return Alert.alert("Error", "Email and Password are required!");
    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await response.json();
      if (data.error) Alert.alert("Error", data.error_description || data.msg);
      else {
         Alert.alert("Success", "Account Create Successful");
         setUser(data.user || { email: cleanEmail }); 
      }
    } catch (error) { Alert.alert("Error", "Network problem"); } 
    finally { setLoading(false); }
  };

  const signIn = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return Alert.alert("Error", "Email and Password are required!");
    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await response.json();
      if (data.error) Alert.alert("Error", "Login Failed");
      else if (data.access_token || data.user) {
        Alert.alert("Success", "Login Successful");
        setUser(data.user || { email: cleanEmail });
      }
    } catch (error) { Alert.alert("Error", "Network problem"); } 
    finally { setLoading(false); }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0c29" />
        <Text style={styles.logo}>CP</Text>
        <Text style={styles.title}>Creators Pulse</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#999" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
          {loading ? <ActivityIndicator size="large" color="#ff7a00" style={{ marginTop: 20 }} /> : (
            <>
              <TouchableOpacity style={styles.loginBtn} onPress={signIn}><Text style={styles.loginText}>Log In</Text></TouchableOpacity>
              <TouchableOpacity style={styles.signupBtn} onPress={signUp}><Text style={styles.signupText}>Create New Account</Text></TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>Hello Creator! 👋</Text>
            <Text style={styles.screenSub}>Explore the creator universe.</Text>
            <View style={styles.brandCard}><Text style={styles.brandName}>Your Total Reach</Text><Text style={styles.brandPay}>0 Views</Text></View>
          </View>
        );
      case 'AI Studio':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>AI Video Studio 🤖</Text>
            <Text style={styles.screenSub}>Apni script yahan likhein aur jadoo dekhein.</Text>
            <TextInput style={[styles.input, {height: 120, textAlignVertical: 'top'}]} placeholder="Kahani yahan type karein..." placeholderTextColor="#999" multiline />
            <TouchableOpacity style={styles.loginBtn}><Text style={styles.loginText}>Generate AI Video</Text></TouchableOpacity>
          </View>
        );
      case 'Reels':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>Create Reels 🎬</Text>
            <Text style={styles.screenSub}>Apni videos upload karein aur viral hon!</Text>
            <TouchableOpacity style={styles.uploadBtn}><Text style={styles.uploadText}>+ Upload New Reel</Text></TouchableOpacity>
          </View>
        );
      case 'Help':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>Help & Support 🎧</Text>
            <Text style={styles.screenSub}>Humari team aapse 24/7 juri hai.</Text>
            <TouchableOpacity style={styles.helpBox}><Text style={styles.helpText}>Chat with Support Team</Text></TouchableOpacity>
          </View>
        );
      case 'Wallet':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>Wallet & KYC 💰</Text>
            <View style={styles.card}>
              <Text style={styles.balanceTitle}>Available Balance</Text>
              <Text style={styles.balanceAmt}>₹0.00</Text>
              <TouchableOpacity style={styles.withdrawBtn} onPress={() => Alert.alert("KYC Pending", "KYC form is pending.")}>
                <Text style={styles.withdrawText}>Complete KYC / Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'Settings':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>Settings ⚙️</Text>
            <Text style={styles.screenSub}>Account: {user.email}</Text>
            <TouchableOpacity style={styles.helpBox}><Text style={styles.helpText}>Change Password</Text></TouchableOpacity>
            <TouchableOpacity style={styles.helpBox}><Text style={styles.helpText}>Delete Account</Text></TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
      
      <View style={styles.header}>
        <Text style={styles.headerLogo}>CP</Text>
        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <Text style={styles.threeDots}>⋮</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={menuOpen} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuBox}>
            <Text style={styles.menuEmail}>{user.email}</Text>
            <View style={styles.menuLine} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveTab('Wallet'); setMenuOpen(false); }}>
              <Text style={styles.menuText}>💰 Wallet / KYC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setActiveTab('Settings'); setMenuOpen(false); }}>
              <Text style={styles.menuText}>⚙️ Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setUser(null); setMenuOpen(false); }}>
              <Text style={[styles.menuText, {color: '#ff4444'}]}>🚪 Log Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      <View style={styles.mainArea}>
        {renderScreen()}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
          <Text style={styles.navIcon}>{activeTab === 'Home' ? '🏠' : '🛖'}</Text>
          <Text style={[styles.navText, activeTab === 'Home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('AI Studio')}>
          <Text style={styles.navIcon}>🤖</Text>
          <Text style={[styles.navText, activeTab === 'AI Studio' && styles.activeNavText]}>AI Studio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Reels')}>
          <Text style={styles.navIcon}>🎬</Text>
          <Text style={[styles.navText, activeTab === 'Reels' && styles.activeNavText]}>Reels</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Help')}>
          <Text style={styles.navIcon}>🎧</Text>
          <Text style={[styles.navText, activeTab === 'Help' && styles.activeNavText]}>Help</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginContainer: { flex: 1, backgroundColor: '#0f0c29', padding: 20, justifyContent: 'center' },
  appContainer: { flex: 1, backgroundColor: '#0f0c29' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: '#1e1b4b' },
  headerLogo: { fontSize: 26, fontWeight: 'bold', color: '#a100ff' },
  threeDots: { fontSize: 32, color: '#fff', fontWeight: 'bold', paddingHorizontal: 10 },
  
  mainArea: { flex: 1, padding: 20 },
  
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  menuBox: { backgroundColor: '#312e81', width: 220, marginTop: 60, marginRight: 20, borderRadius: 15, padding: 15, elevation: 5 },
  menuEmail: { color: '#bbb', fontSize: 13, marginBottom: 10, textAlign: 'center' },
  menuLine: { height: 1, backgroundColor: '#4f46e5', marginBottom: 10 },
  menuItem: { paddingVertical: 12 },
  menuText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  logo: { fontSize: 60, fontWeight: 'bold', color: '#a100ff', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 40 },
  form: { backgroundColor: '#1e1b4b', padding: 20, borderRadius: 15 },
  input: { backgroundColor: '#312e81', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  loginBtn: { backgroundColor: '#ff7a00', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  signupBtn: { padding: 15, alignItems: 'center', marginTop: 15 },
  signupText: { color: '#a100ff', fontWeight: 'bold', fontSize: 16 },
  
  screenContent: { flex: 1 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  screenSub: { fontSize: 15, color: '#aaa', marginBottom: 20 },
  card: { backgroundColor: '#1e1b4b', padding: 25, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  balanceTitle: { color: '#bbb', fontSize: 16, marginBottom: 10 },
  balanceAmt: { color: '#4ade80', fontSize: 42, fontWeight: 'bold', marginBottom: 20 },
  withdrawBtn: { backgroundColor: '#a100ff', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 },
  withdrawText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  brandCard: { backgroundColor: '#1e1b4b', padding: 20, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  brandName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  brandPay: { color: '#4ade80', fontSize: 18, fontWeight: 'bold' },

  uploadBtn: { backgroundColor: '#312e81', padding: 20, borderRadius: 15, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#4f46e5' },
  uploadText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  helpBox: { backgroundColor: '#1e1b4b', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  helpText: { color: '#4ade80', fontSize: 16, fontWeight: 'bold' },

  // FINAL FIX: PADDING BOTTOM 65 KAR DIYA GAYA HAI
  bottomNav: { flexDirection: 'row', backgroundColor: '#1e1b4b', paddingTop: 15, paddingBottom: 65, paddingHorizontal: 5, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 26, marginBottom: 6 }, 
  navText: { color: '#aaa', fontSize: 13, fontWeight: 'bold' }, 
  activeNavText: { color: '#ff7a00', fontSize: 14 } 
});
      
