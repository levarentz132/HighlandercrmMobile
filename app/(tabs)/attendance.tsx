import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function AttendanceScreen() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setCheckInTime(timeString);
      setIsCheckedIn(true);
      Alert.alert('Success', `Checked in at ${timeString}`);
    } else {
      Alert.alert('Check Out', 'Are you sure you want to check out?', [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Check Out', 
          onPress: () => {
            setIsCheckedIn(false);
            setCheckInTime(null);
            Alert.alert('Success', 'Checked out successfully');
          }
        }
      ]);
    }
  };

  const attendanceHistory = [
    { date: 'Aug 4, 2025', checkIn: '9:00 AM', checkOut: '6:00 PM', hours: '8.5h', status: 'present' },
    { date: 'Aug 3, 2025', checkIn: '8:45 AM', checkOut: '5:45 PM', hours: '8.5h', status: 'present' },
    { date: 'Aug 2, 2025', checkIn: '9:15 AM', checkOut: '6:15 PM', hours: '8.5h', status: 'late' },
    { date: 'Aug 1, 2025', checkIn: '-', checkOut: '-', hours: '0h', status: 'absent' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10B981';
      case 'late': return '#F59E0B';
      case 'absent': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedView style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Attendance</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Track your daily attendance</ThemedText>
        </ThemedView>
      </LinearGradient>

      {/* Check In/Out Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.checkInCard}>
          <ThemedView style={styles.checkInHeader}>
            <IconSymbol name="clock.fill" size={32} color="#10B981" />
            <ThemedView style={styles.checkInInfo}>
              <ThemedText style={styles.checkInTitle}>
                {isCheckedIn ? 'Checked In' : 'Ready to Check In'}
              </ThemedText>
              <ThemedText style={styles.checkInTime}>
                {isCheckedIn ? `Since ${checkInTime}` : 'Tap to start your day'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          
          <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
            <LinearGradient
              colors={isCheckedIn ? ['#EF4444', '#DC2626'] : ['#10B981', '#059669']}
              style={styles.checkInGradient}
            >
              <IconSymbol 
                name={isCheckedIn ? "clock.badge.xmark" : "clock.badge.checkmark"} 
                size={24} 
                color="white" 
              />
              <ThemedText style={styles.checkInButtonText}>
                {isCheckedIn ? 'Check Out' : 'Check In'}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* Quick Stats */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>This Week</ThemedText>
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statBox}>
            <ThemedText style={styles.statNumber}>40.5</ThemedText>
            <ThemedText style={styles.statLabel}>Hours</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statBox}>
            <ThemedText style={styles.statNumber}>4</ThemedText>
            <ThemedText style={styles.statLabel}>Days Present</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statBox}>
            <ThemedText style={styles.statNumber}>1</ThemedText>
            <ThemedText style={styles.statLabel}>Late Days</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Attendance History */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent History</ThemedText>
        <ThemedView style={styles.historyContainer}>
          {attendanceHistory.map((record, index) => (
            <ThemedView key={index} style={styles.historyItem}>
              <ThemedView style={styles.historyLeft}>
                <ThemedView style={[styles.statusDot, { backgroundColor: getStatusColor(record.status) }]} />
                <ThemedView style={styles.historyInfo}>
                  <ThemedText style={styles.historyDate}>{record.date}</ThemedText>
                  <ThemedText style={styles.historyStatus}>{record.status}</ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.historyRight}>
                <ThemedText style={styles.historyTime}>{record.checkIn} - {record.checkOut}</ThemedText>
                <ThemedText style={styles.historyHours}>{record.hours}</ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
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
    height: 160,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
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
  checkInCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  checkInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  checkInInfo: {
    marginLeft: 15,
    backgroundColor: 'transparent',
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  checkInTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  checkInButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  checkInGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  statBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 80) / 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
    textAlign: 'center',
  },
  historyContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'transparent',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  historyInfo: {
    backgroundColor: 'transparent',
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  historyStatus: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  historyTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyHours: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
});
