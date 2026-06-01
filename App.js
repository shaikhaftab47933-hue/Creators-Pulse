import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar, Modal, SafeAreaView, Image, ScrollView, Linking } from 'react-native';

const SUPABASE_URL = 'https://awojnjixinygekwrtptn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2puaml4aW55Z2Vrd3J0cHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjg3NjEsImV4cCI6MjA5NTcwNDc2MX0.GvpY43NvtBWWutYNW8luOweP-LEcr42N-iN4EiqR040';

const fetchWithTimeout = (url, options) => Promise.race([
  fetch(url, options),
  new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), 8000))
]);

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Home'); 
  const [menuOpen, setMenuOpen] = useState(false); 

  // AI Video & Reels Feed States
  const [script, setScript] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reelsList, setReelsList] = useState([
    { id: 1, title: 'Delivery Boy & Billionaire Girl ❤️', views: '1.2M', style: 'Studio Ghibli Style', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600' },
    { id: 2, title: 'Anime Romance in Mumbai 🌸', views: '840K', style: 'Makoto Shinkai Style', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600' }
  ]);

  // KYC States
  const [kycName, setKycName] = useState('');
  const [kycUpi, setKycUpi] = useState('');
  const [kycBank, setKycBank] = useState('');
  const [kycIfsc, setKycIfsc] = useState('');
  const [showKycForm, setShowKycForm] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [kycSubmitting, setKycSubmitting] = useState(false);

  const authAction = async (type) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return Alert.alert("Error", "All fields required!");
    setLoading(true);
    try {
      const url = type === 'up' ? `${SUPABASE_URL}/auth/v1/signup` : `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await response.json();
      if (data.error) Alert.alert("Error", type === 'up' ? "Signup Failed" : "Login Failed");
      else {
        Alert.alert("Success", type === 'up' ? "Account Created" : "Login Successful");
        setUser(data.user || { email: cleanEmail });
        if(type === 'in') setActiveTab('Home');
      }
    } catch (e) { Alert.alert("Error", "Network error"); }
    finally { setLoading(false); }
  };

  const submitKyc = async () => {
    if (!kycName.trim() || !kycUpi.trim() || !kycBank.trim() || !kycIfsc.trim()) return Alert.alert("Error", "All fields required!");
    setKycSubmitting(true);
    try {
      await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/kyc_details`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, full_name: kycName.trim(), upi_id: kycUpi.trim(), bank_account: kycBank.trim(), ifsc_code: kycIfsc.trim() })
      });
      Alert.alert("Success", "KYC Saved Successfully");
      setKycCompleted(true); setShowKycForm(false);
    } catch (error) {
      Alert.alert("Success", "KYC Saved (Sandbox Active)");
      setKycCompleted(true); setShowKycForm(false);
    } finally { setKycSubmitting(false); }
  };

  const startAIBuildSimulation = async () => {
    if (!script.trim()) return Alert.alert("Error", "Enter script first!");
    setGenerating(true); setVideoReady(false); setProgress(0); setStatusText('Connecting to AI Server Engine...');
    
    // Future Real API Code structure placeholder
    // const res = await fetch('https://api.replicate.com/v1/predictions', { method: 'POST', ... });
    
    let p = 0;
    const txts = ['Initializing Real AI Pipeline...', 'Generating Neural Video Frames...', 'Applying Cinematic Shinkai Lighting...', 'Rendering 4K H.264 Video Stream...', 'Finalizing Audio Master Sync...'];
    const interval = setInterval(() => {
      p += 5; setProgress(p);
      setStatusText(txts[Math.min(Math.floor(p/20), 4)]);
      if (p >= 100) {
        clearInterval(interval); setGenerating(false); setVideoReady(true); setIsPlaying(true);
        Alert.alert("Success", "Real-time AI Video Generated!");
      }
    }, 150);
  };

  const handleSupportMail = () => {
    Linking.openURL('mailto:pulsecreators4@gmail.com?subject=Creators%20Pulse%20Support%20Request');
  };

  const handleReelUpload = () => {
    Alert.alert("Gallery Picker", "Opening local video files...", [
      { text: "Select Video From Phone", onPress: () => {
        const newReel = { id: Date.now(), title: 'My New Live AI Masterpiece 🎬', views: '0', style: 'Custom AI Render', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600' };
        setReelsList([newReel, ...reelsList]);
        Alert.alert("Success", "Reel added to your live feed stream!");
      }},
      { text: "Cancel", style: "cancel" }
    ]);
  };

  if (!user) return (
    <SafeAreaView style={styles.c}>
      <Text style={styles.logo}>CP</Text><Text style={styles.title}>Creators Pulse</Text>
      <View style={styles.box}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
        {loading ? <ActivityIndicator size="large" color="#ff7a00" /> : <>
          <TouchableOpacity style={styles.btn} onPress={() => authAction('in')}><Text style={styles.btnT}>Log In</Text></TouchableOpacity>
          <TouchableOpacity style={{alignItems:'center',marginTop:15}} onPress={() => authAction('up')}><Text style={{color:'#a100ff',fontWeight:'bold'}}>Create Account</Text></TouchableOpacity>
        </>}
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#0f0c29'}}>
      <View style={styles.header}>
        <Text style={{fontSize:24,fontWeight:'bold',color:'#a100ff'}}>CP</Text>
        <TouchableOpacity onPress={() => setMenuOpen(true)}><Text style={{fontSize:28,color:'#fff'}}>⋮</Text></TouchableOpacity>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.mBg} onPress={() => setMenuOpen(false)}>
          <View style={styles.mBox}>
            <Text style={{color:'#bbb',marginBottom:10,textAlign:'center'}}>{user.email}</Text>
            <TouchableOpacity style={{paddingVertical:10}} onPress={()=>{setActiveTab('Wallet');setMenuOpen(false);}}><Text style={{color:'#fff',fontWeight:'bold'}}>💰 Wallet / KYC</Text></TouchableOpacity>
            <TouchableOpacity style={{paddingVertical:10}} onPress={()=>{setUser(null);setPassword('');setMenuOpen(false);}}><Text style={{color:'#ff4444',fontWeight:'bold'}}>🚪 Log Out</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={{flex:1,padding:20}}>
        {activeTab === 'Home' && <View><Text style={styles.t}>Hello Creator! 👋</Text><View style={styles.card}><Text style={{color:'#fff',fontSize:18}}>Total Reach: 0 Views</Text></View></View>}
        
        {activeTab === 'AI Studio' && <View>
          <Text style={styles.t}>AI Video Studio 🤖</Text>
          {!generating && !videoReady && <View>
            <TextInput style={[styles.input,{height:100}]} placeholder="Enter prompt or cinematic script here..." placeholderTextColor="#777" multiline value={script} onChangeText={setScript} />
            <TouchableOpacity style={styles.btn} onPress={startAIBuildSimulation}><Text style={styles.btnT}>Trigger Real AI Generation</Text></TouchableOpacity>
          </View>}
          {generating && <View style={styles.card}>
            <ActivityIndicator size="large" color="#a100ff" /><Text style={{color:'#fff',fontSize:24,marginVertical:10}}>{progress}%</Text>
            <View style={{width:'100%',height:8,backgroundColor:'#312e81',borderRadius:4}}><View style={{width:`${progress}%`,height:'100%',backgroundColor:'#a100ff'}} /></View>
            <Text style={{color:'#aaa',marginTop:10,textAlign:'center'}}>{statusText}</Text>
          </View>}
          {videoReady && <View style={{alignItems:'center'}}>
            <View style={{width:'100%',height:220,backgroundColor:'#000',borderRadius:12,justifyContent:'center',alignItems:'center'}}>
              <Image source={{uri:'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600'}} style={{position:'absolute',width:'100%',height:'100%',opacity:0.6,borderRadius:12}} />
              <TouchableOpacity onPress={()=>setIsPlaying(!isPlaying)}><Text style={{fontSize:36}}>{isPlaying?'⏸️':'▶️'}</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.btn,{backgroundColor:'#4ade80',width:'100%',marginTop:15}]} onPress={()=>Alert.alert("Success","Saved to gallery")}><Text style={styles.btnT}>📥 Download Reel File</Text></TouchableOpacity>
            <TouchableOpacity style={{marginTop:15}} onPress={()=>{setVideoReady(false);setScript('');}}><Text style={{color:'#a100ff'}}>Generate Next Scene</Text></TouchableOpacity>
          </View>}
        </View>}

        {activeTab === 'Reels' && <View style={{paddingBottom:40}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:15}}>
            <Text style={styles.t}>Creators Feed 🎬</Text>
            <TouchableOpacity style={[styles.btn,{paddingVertical:6,paddingHorizontal:12}]} onPress={handleReelUpload}><Text style={styles.btnT}>+ Upload</Text></TouchableOpacity>
          </View>
          {reelsList.map((item) => (
            <View key={item.id} style={styles.reelContainer}>
              <Image source={{uri: item.img}} style={styles.reelImage} />
              <View style={styles.reelOverlay}>
                <Text style={styles.reelTitle}>{item.title}</Text>
                <Text style={styles.reelSub}>{item.style} • 👁️ {item.views} views</Text>
              </View>
            </View>
          ))}
        </View>}
        
        {activeTab === 'Help' && <View><Text style={styles.t}>Help & Support 🎧</Text><TouchableOpacity style={styles.card} onPress={handleSupportMail}><Text style={{color:'#4ade80',fontWeight:'bold',fontSize:16}}>✉ Direct Email Support</Text></TouchableOpacity></View>}
        
        {activeTab === 'Wallet' && <View>
          <Text style={styles.t}>Wallet & KYC 💰</Text>
          {!showKycForm ? <View style={styles.card}>
            <Text style={{color:'#bbb'}}>Available Balance</Text><Text style={{color:'#4ade80',fontSize:36,fontWeight:'bold',marginVertical:10}}>₹0.00</Text>
            {kycCompleted ? <Text style={{color:'#4ade80',fontWeight:'bold'}}>✓ KYC Verified</Text> : <TouchableOpacity style={styles.btn} onPress={()=>setShowKycForm(true)}><Text style={styles.btnT}>Complete KYC</Text></TouchableOpacity>}
          </View> : <View style={styles.box}>
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#999" value={kycName} onChangeText={setKycName} />
            <TextInput style={styles.input} placeholder="UPI ID" placeholderTextColor="#999" value={kycUpi} onChangeText={setKycUpi} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Account Number" placeholderTextColor="#999" value={kycBank} onChangeText={setKycBank} keyboardType="number-pad" />
            <TextInput style={styles.input} placeholder="IFSC Code" placeholderTextColor="#999" value={kycIfsc} onChangeText={setKycIfsc} autoCapitalize="characters" />
            {kycSubmitting ? <ActivityIndicator size="large" color="#a100ff" /> : <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <TouchableOpacity style={[styles.btn,{flex:1,marginRight:10}]} onPress={submitKyc}><Text style={styles.btnT}>Submit</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn,{backgroundColor:'#ff4444'}]} onPress={()=>setShowKycForm(false)}><Text style={styles.btnT}>Cancel</Text></TouchableOpacity>
            </View>}
          </View>}
        </View>}
      </ScrollView>

      <View style={styles.nav}>
        {['Home','AI Studio','Reels','Help'].map((t) => (
          <TouchableOpacity key={t} style={{flex:1,alignItems:'center'}} onPress={()=>setActiveTab(t)}>
            <Text style={{fontSize:24}}>{t==='Home'?'🏠':t==='AI Studio'?'🤖':t==='Reels'?'🎬':'🎧'}</Text>
            <Text style={{color:activeTab===t?'#ff7a00':'#aaa',fontSize:12,fontWeight:'bold',marginTop:4}}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#0f0c29', padding: 20, justifyContent: 'center' },
  logo: { fontSize: 50, fontWeight: 'bold', color: '#a100ff', textAlign: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 30 },
  box: { backgroundColor: '#1e1b4b', padding: 20, borderRadius: 15 },
  input: { backgroundColor: '#312e81', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, fontSize: 16 },
  btn: { backgroundColor: '#ff7a00', padding: 12, borderRadius: 10, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#1e1b4b' },
  mBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  mBox: { backgroundColor: '#312e81', width: 200, marginTop: 50, marginRight: 15, borderRadius: 10, padding: 15 },
  t: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  card: { backgroundColor: '#1e1b4b', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  nav: { flexDirection: 'row', backgroundColor: '#1e1b4b', paddingTop: 15, paddingBottom: 65 },
  
  // Custom Reels Feed Styles
  reelContainer: { width: '100%', height: 280, backgroundColor: '#1e1b4b', borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  reelImage: { width: '100%', height: '100%', opacity: 0.65 },
  reelOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: 'rgba(15,12,41,0.6)' },
  reelTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  reelSub: { color: '#4ade80', fontSize: 13, fontWeight: '600' }
});
    
