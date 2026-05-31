import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [balance, setBalance] = useState(2000);

  const renderContent = () => {
    switch(activeTab) {
      case 'Home': return <Text style={styles.title}>Welcome, Mohammad!{"\n"}Balance: ₹{balance}</Text>;
      case 'Wallet': return (
        <View style={styles.center}>
          <Text style={styles.title}>Earnings: ₹{balance}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => { setBalance(0); Alert.alert("Success", "Withdrawn!"); }}>
            <Text style={styles.btnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>);
      case 'AI': return <Text style={styles.title}>AI Video Studio{"\n"}Active</Text>;
      case 'Collabs': return <Text style={styles.title}>Brand Collabs{"\n"}No Active Deals</Text>;
      case 'Support': return <Text style={styles.title}>Help & Support{"\n"}Contact: support@pulse.com</Text>;
      case 'Pro': return <Text style={styles.title}>Subscription{"\n"}Plan: Free Member</Text>;
      default: return <Text style={styles.title}>Welcome, Mohammad!</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
      
      {/* NAVIGATION BAR - Shifted higher */}
      <View style={styles.bottomNav}>
        {['Home', 'Wallet', 'AI', 'Collabs', 'Support', 'Pro'].map((tab) => (
          <TouchableOpacity key={tab} style={styles.navBtn} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.navText, activeTab === tab && styles.activeText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1326' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  center: { alignItems: 'center' },
  title: { fontSize: 20, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  btn: { backgroundColor: '#ef4444', padding: 15, borderRadius: 10, marginTop: 20, width: 150 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  // Yahan changes kiye hain: marginBottom badha diya hai
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 15, 
    backgroundColor: '#1b243a', 
    borderTopWidth: 1, 
    borderColor: '#333',
    marginBottom: 40 // Yeh value buttons ko upar push karegi
  },
  navBtn: { padding: 5 },
  navText: { color: '#888', fontSize: 13, fontWeight: 'bold' },
  activeText: { color: '#8b5cf6' }
});
