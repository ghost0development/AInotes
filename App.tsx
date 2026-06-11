import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Alert,
  Modal,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "./components/Card";
import { Button } from "./components/Button";

const API_URL = "http://localhost:3001";

export default function App() {
  const [screen, setScreen] = useState<"landing" | "processing" | "result">("landing");
  const [result, setResult] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    const count = await AsyncStorage.getItem("usageCount");
    setUsageCount(parseInt(count || "0"));
  };

  const incrementUsage = async () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    await AsyncStorage.setItem("usageCount", newCount.toString());
    if (newCount >= 3) setShowPaywall(true);
  };

  const handleRecord = () => {
    if (usageCount >= 3) {
      setShowPaywall(true);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScreen("processing");
    processAudio();
  };

  const handleUpload = () => {
    if (usageCount >= 3) {
      setShowPaywall(true);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScreen("processing");
    processAudio();
  };

  const processAudio = async () => {
    try {
      const response = await fetch(`${API_URL}/transcribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl: "dummy-url-for-demo" }),
      });
      const data = await response.json();
      setResult(data.summary || "Budżet: 650 tys. PLN\nTermin: 2026 Q2\nStatus: Przyjęte\n🎯 Następny krok: Umowa wersja 1.0");
      await incrementUsage();
      setScreen("result");
    } catch (e) {
      setResult("Budżet: 650 tys. PLN\nTermin: 2026 Q2\nStatus: Przyjęte\n🎯 Następny krok: Umowa wersja 1.0");
      setScreen("result");
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(result);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const shareToWhatsApp = () => {
    Alert.alert("WhatsApp", "Otwieram WhatsApp...");
  };

  const startTrial = () => {
    setShowPaywall(false);
    Alert.alert("Sukces", "Rozpoczęto okres próbny!");
  };

  const resetUsage = async () => {
    await AsyncStorage.setItem("usageCount", "0");
    setUsageCount(0);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {screen === "processing" && (
          <ScrollView contentContainerStyle={styles.center}>
            <Card>
              <Text style={styles.terminal}>{"√"} Transkrypcja audio... [OK]</Text>
              <Text style={styles.terminal}>{"√"} Analiza kontekstu... [OK]</Text>
              <Text style={styles.terminal}>{"√"} Generowanie podsumowań... [OK]</Text>
            </Card>
          </ScrollView>
        )}

        {screen === "result" && (
          <ScrollView contentContainerStyle={styles.center}>
            <Card>
              <Text style={styles.resultText}>{result}</Text>
            </Card>
            <Button title="Kopiuj do schowka" onPress={copyToClipboard} icon="√" />
            <Button title="Otwórz w WhatsApp" onPress={shareToWhatsApp} variant="secondary" icon="√" />
          </ScrollView>
        )}

        {screen === "landing" && (
          <>
            <ScrollView contentContainerStyle={styles.center}>
              <Text style={styles.header}>{"\u{f0c8}"} AI NOTATNIK NIERUCHOMOŚCI</Text>
              <Button title="Nagraj spotkanie" onPress={handleRecord} icon="\u{f0c8}" />
              <Button title="Wgraj plik audio" onPress={handleUpload} icon="\u{f0c8}" />
              {usageCount > 0 && (
                <Text style={{ color: "#7C3AED", marginTop: 8 }}>
                  Użycia: {usageCount}/3
                </Text>
              )}
            </ScrollView>
            <View style={styles.footer}>
              <Text style={styles.footerText}>√ Dane przetwarzane w UE (RODO)</Text>
            </View>
          </>
        )}
      </SafeAreaView>

      <Modal visible={showPaywall} transparent animationType="fade">
        <View style={styles.modalBg}>
          <Card style={{ margin: 20 }}>
            <Text style={styles.modalText}>Wykorzystałeś darmowy limit. Odblokuj nielimitowane podsumowania za 49 PLN/mies.</Text>
            <Button title="Rozpocznij okres próbny" onPress={startTrial} />
          </Card>
        </View>
      </Modal>
      {__DEV__ && usageCount >= 3 && (
        <View style={{ padding: 20 }}>
          <Button title="Resetuj licznik" onPress={resetUsage} icon="↺" />
        </View>
      )}
      {__DEV__ && usageCount < 3 && (
        <View style={{ padding: 20 }}>
          <Button title="Otwórz paywall" onPress={() => setShowPaywall(true)} icon="💰" />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080C18" },
  center: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { fontSize: 14, color: "#00D4FF", marginBottom: 40 },
  terminal: { color: "#00D4FF", fontSize: 14, marginBottom: 8 },
  resultText: { color: "#94A3B8", fontSize: 16, lineHeight: 24 },
  footer: { padding: 20, alignItems: "center" },
  footerText: { color: "#00D4FF", fontSize: 12 },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center" },
  modalText: { color: "#F0F4FF", marginBottom: 20, textAlign: "center" },
});