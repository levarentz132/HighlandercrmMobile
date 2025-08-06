import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
// ...existing code...

export default function DashboardScreen() {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        const response = await fetch('https://crm.highlander.co.id/api/user', {
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

  const quickActions = [
    { id: 1, title: 'Check In', icon: 'clock.fill' as const, color: '#10B981', route: '/attendance' },
    { id: 2, title: 'Apply Leave', icon: 'calendar.badge.plus' as const, color: '#F59E0B', route: '/leaves' },
    { id: 3, title: 'Overtime', icon: 'clock.arrow.circlepath' as const, color: '#8B5CF6', route: '/overtime' },
    { id: 4, title: 'Clients', icon: 'person.3.fill' as const, color: '#EF4444', route: '/crm' },
  ];

  const stats = [
    { label: 'Hours Today', value: '8.5', color: '#06B6D4' },
    { label: 'This Month', value: '156h', color: '#10B981' },
    { label: 'Pending Leaves', value: '2', color: '#F59E0B' },
    { label: 'Active Clients', value: '12', color: '#8B5CF6' },
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
          <ThemedText style={styles.date}>Monday, August 4, 2025</ThemedText>
        </ThemedView>
      </LinearGradient>

      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <ThemedView style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.actionCard}>
              <LinearGradient
                colors={[action.color, action.color + '80']}
                style={styles.actionGradient}
              >
                <IconSymbol name={action.icon} size={28} color="white" />
                <ThemedText style={styles.actionText}>{action.title}</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Stats Cards */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Today's Overview</ThemedText>
        <ThemedView style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <ThemedView key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Recent Activity */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
        <ThemedView style={styles.activityList}>
          <ThemedView style={styles.activityItem}>
            <ThemedView style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
            <ThemedView style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>Checked in at 9:00 AM</ThemedText>
              <ThemedText style={styles.activityTime}>2 hours ago</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.activityItem}>
            <ThemedView style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
            <ThemedView style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>Leave request submitted</ThemedText>
              <ThemedText style={styles.activityTime}>Yesterday</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.activityItem}>
            <ThemedView style={[styles.activityDot, { backgroundColor: '#8B5CF6' }]} />
            <ThemedView style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>Client meeting completed</ThemedText>
              <ThemedText style={styles.activityTime}>2 days ago</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'transparent',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
