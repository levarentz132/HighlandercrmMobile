import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const menuItems = [
    { id: 1, title: 'Personal Information', icon: 'person.fill' as const, action: () => Alert.alert('Personal Information') },
    { id: 2, title: 'Attendance Settings', icon: 'clock.fill' as const, action: () => Alert.alert('Attendance Settings') },
    { id: 3, title: 'Leave Policies', icon: 'calendar' as const, action: () => Alert.alert('Leave Policies') },
    { id: 4, title: 'Notifications', icon: 'bell.fill' as const, action: () => Alert.alert('Notifications') },
    { id: 5, title: 'Security', icon: 'lock.fill' as const, action: () => Alert.alert('Security') },
    { id: 6, title: 'Help & Support', icon: 'questionmark.circle.fill' as const, action: () => Alert.alert('Help & Support') },
    { id: 7, title: 'About', icon: 'info.circle.fill' as const, action: () => Alert.alert('About') },
    { id: 8, title: 'Logout', icon: 'arrow.right.square.fill' as const, action: () => Alert.alert('Logout', 'Are you sure you want to logout?') },
  ];

  const stats = [
    { label: 'Total Hours', value: '1,245h', color: '#10B981' },
    { label: 'Days Present', value: '156', color: '#6366F1' },
    { label: 'Leaves Taken', value: '8', color: '#F59E0B' },
    { label: 'Overtime Hours', value: '45h', color: '#8B5CF6' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Profile */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedView style={styles.profileSection}>
          <ThemedView style={styles.avatarContainer}>
            <ThemedView style={styles.avatar}>
              <ThemedText style={styles.avatarText}>JD</ThemedText>
            </ThemedView>
            <TouchableOpacity style={styles.editButton}>
              <IconSymbol name="pencil.circle.fill" size={24} color="white" />
            </TouchableOpacity>
          </ThemedView>
          <ThemedText style={styles.userName}>John Doe</ThemedText>
          <ThemedText style={styles.userRole}>Senior Developer</ThemedText>
          <ThemedText style={styles.userEmail}>john.doe@company.com</ThemedText>
        </ThemedView>
      </LinearGradient>

      {/* Quick Stats */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Your Stats</ThemedText>
        <ThemedView style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <ThemedView key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <ThemedView style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="doc.text.fill" size={24} color="white" />
              <ThemedText style={styles.quickActionText}>Request Certificate</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.quickActionGradient}
            >
              <IconSymbol name="chart.bar.fill" size={24} color="white" />
              <ThemedText style={styles.quickActionText}>View Reports</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* Menu Items */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
        <ThemedView style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
              <ThemedView style={styles.menuLeft}>
                <ThemedView style={styles.menuIcon}>
                  <IconSymbol name={item.icon} size={20} color="#6366F1" />
                </ThemedView>
                <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
              </ThemedView>
              <IconSymbol name="chevron.right" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      {/* App Info */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.appInfo}>
          <ThemedText style={styles.appName}>Highlander CRM Mobile</ThemedText>
          <ThemedText style={styles.appVersion}>Version 1.0.0</ThemedText>
          <ThemedText style={styles.appCopyright}>© 2025 Highlander Technologies</ThemedText>
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
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'transparent',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
