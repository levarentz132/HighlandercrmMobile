import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        const response = await fetch('http://crm.highlander.co.id/api/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        // handle error (optional)
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Format today's date in Indonesian
  const todayDate = useMemo(() => {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
  }, []);

  // Update quickActions to use correct expo-router paths
  const quickActions = [
    { id: 1, title: 'Dashboard', icon: 'chart.bar.fill', color: '#6366F1', route: '/index' },
    { id: 2, title: 'Check In/Out', icon: 'clock.fill', color: '#10B981', route: '/attendance' },
    { id: 3, title: 'Izin/Cuti', icon: 'calendar.badge.clock', color: '#F59E0B', route: '/leaves' },
    { id: 4, title: 'Lembur/Dinas', icon: 'person.3.fill', color: '#8B5CF6', route: '/overtime' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedView style={styles.headerContent}>
          <ThemedText style={styles.greeting}>Good Morning!</ThemedText>
          <ThemedText style={styles.userName}>
            {loadingUser ? 'Loading...' : user?.name || 'User'}
          </ThemedText>
          <ThemedText style={styles.date}>{todayDate}</ThemedText>
        </ThemedView>
      </LinearGradient>

      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <ThemedView style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
            >
              <LinearGradient
                colors={[action.color, action.color + '80']}
                style={styles.actionGradient}
              >
                <IconSymbol name={action.icon as any} size={28} color="white" /> {/* Cast icon to any */}
                <ThemedText style={styles.actionText}>{action.title}</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Explanation Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Panduan Penggunaan Aplikasi</ThemedText>
        <ThemedText style={styles.explanationText}>
          1. Login: Masukkan username dan password Anda untuk masuk ke aplikasi.
        </ThemedText>
        <ThemedText style={styles.explanationText}>
          2. Absensi: Pilih menu "Check In/Out" untuk melakukan check-in dan check-out setiap hari kerja.
        </ThemedText>
        <ThemedText style={styles.explanationText}>
          3. Dinas & Lembur: Ajukan permohonan dinas atau lembur melalui menu "Lembur / Dinas". Isi tanggal dan alasan pengajuan, lalu kirim permohonan.
        </ThemedText>
        <ThemedText style={styles.explanationText}>
          4. Cuti: Ajukan cuti melalui menu "Izin/Cuti" dengan mengisi tanggal dan alasan cuti.
        </ThemedText>
        <ThemedText style={styles.explanationText}>
          5. Riwayat: Lihat riwayat absensi, dinas, lembur, dan cuti Anda di masing-masing menu.
        </ThemedText>
        <ThemedText style={styles.explanationText}>
          7. Notifikasi: Periksa notifikasi untuk informasi terbaru terkait pengajuan Anda.
        </ThemedText>
        <ThemedText style={styles.explanationText}>
          Jika mengalami kendala, silakan hubungi admin HRD Highlander.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 200,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  date: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 5,
  },
  section: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1F2937',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  actionCard: {
    width: (width - 60) / 2,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 10,
    lineHeight: 20,
  },
});
