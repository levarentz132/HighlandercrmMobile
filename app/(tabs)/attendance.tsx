import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const AttendanceScreen: React.FC = () => {
  // Custom theme for light backgrounds and accent colors
  const theme = {
    background: '#F8FAFC',
    card: 'white',
    accent: '#10B981',
    text: '#1F2937',
    subtitle: '#6B7280',
    border: '#F3F4F6',
    error: '#EF4444',
    info: '#059669',
    highlight: '#E6FFF5',
  };
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastAttendance, setLastAttendance] = useState<any | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationReason, setLocationReason] = useState('Arrived at office');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingClockType, setPendingClockType] = useState<'in' | 'out' | null>(null);
  // Designated office coordinates
  const OFFICE_COORDS = { lat: -6.1519869, lng: 106.7615622 };
  const OFFICE_RADIUS_METERS = 100;

  // Helper: Calculate distance between two lat/lng points (Haversine formula)
  function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  // Get device location on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation(null);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoadingHistory(true);
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        const response = await fetch(`https://crm.highlander.co.id/api/attendance?per_page=20&page=${page}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const result = await response.json();
        // Laravel pagination: result.data is the array, result.current_page, result.last_page
        const newData = Array.isArray(result.data) ? result.data : [];
        setAttendanceHistory(prev => page === 1 ? newData : [...prev, ...newData]);
        setHasMore(result.current_page < result.last_page);
        if (newData.length > 0) {
          const last = newData[0]; // assuming latest is first
          setLastAttendance(last);
          // Check if last attendance is from a previous day and not checked out
          if (last.type === 1 && !last.clock_out_time) {
            const lastDate = new Date(last.date);
            const today = new Date();
            if (
              lastDate.getFullYear() !== today.getFullYear() ||
              lastDate.getMonth() !== today.getMonth() ||
              lastDate.getDate() !== today.getDate()
            ) {
              // Submit static clock out for previous day
              const staticClockOut = async () => {
                const payload = {
                  status: 'out',
                  lat: OFFICE_COORDS.lat,
                  lng: OFFICE_COORDS.lng,
                  location_reason: 'Auto clock out',
                  client_time: `${last.date} 17:00:00`,
                };
                await fetch('https://crm.highlander.co.id/api/attendance/clock', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
                });
              };
              await staticClockOut();
              // Refetch attendance after auto clock out
              const refetch = await fetch(`https://crm.highlander.co.id/api/attendance?per_page=20&page=1`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
                },
              });
              const refetchResult = await refetch.json();
              const refetchData = Array.isArray(refetchResult.data) ? refetchResult.data : [];
              setAttendanceHistory(refetchData);
              setHasMore(refetchResult.current_page < refetchResult.last_page);
              if (refetchData.length > 0) {
                const lastRefetch = refetchData[0];
                setLastAttendance(lastRefetch);
                if (lastRefetch.type === 1 && !lastRefetch.clock_out_time) {
                  setIsCheckedIn(true);
                  setCheckInTime(lastRefetch.clock_in_time || null);
                } else {
                  setIsCheckedIn(false);
                  setCheckInTime(null);
                }
              } else {
                setIsCheckedIn(false);
                setCheckInTime(null);
              }
              setLoadingHistory(false);
              return;
            }
            setIsCheckedIn(true);
            setCheckInTime(last.clock_in_time || null);
          } else {
            setIsCheckedIn(false);
            setCheckInTime(null);
          }
        } else {
          setIsCheckedIn(false);
          setCheckInTime(null);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchAttendance();
  }, [page]);

  // Infinite scroll handler
  const handleLoadMore = () => {
    if (hasMore && !loadingHistory) {
      setPage(prev => prev + 1);
    }
  };

  // Clock in/out handler (shows confirmation modal)
  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert('Location Error', 'Unable to get device location.');
      return;
    }
    // Determine status: 'in' or 'out'
    const status = isCheckedIn ? 'out' : 'in';
    setPendingClockType(status);
    // Check if outside office radius
    const dist = getDistanceMeters(location.lat, location.lng, OFFICE_COORDS.lat, OFFICE_COORDS.lng);
    if (dist > OFFICE_RADIUS_METERS) {
      setShowLocationInput(true);
      setLocationReason('Outside office');
    } else {
      setShowLocationInput(false);
      setLocationReason('Arrived at office');
    }
    setShowConfirmModal(true);
  };

  // Submit clock in/out to API
  const submitClock = async () => {
    setShowConfirmModal(false);
    if (!location || !pendingClockType) return;
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');
      // Always use current device time for submission
      let clientTime;
      if (pendingClockType === 'in') {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        clientTime = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      } else {
        // For clock out, use current time as well (unless you want to customize)
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        clientTime = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      }
      const payload = {
        status: pendingClockType,
        lat: location.lat,
        lng: location.lng,
        location_reason: locationReason,
        client_time: clientTime,
      };
      if (pendingClockType) {
        console.log('Clock In Submission:', payload);
      }
      const response = await fetch('https://crm.highlander.co.id/api/attendance/clock', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', `Clock ${pendingClockType === 'in' ? 'in' : 'out'} successful.`);
        // Force refresh by resetting to first page (triggers useEffect)
        setPage(1);
      } else {
        Alert.alert('Error', result.message || 'Failed to submit attendance.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit attendance.');
    } finally {
      setPendingClockType(null);
    }
  };

  // Map status code to color
  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return '#10B981'; // present
      case 2: return '#F59E0B'; // late
      case 0: return '#EF4444'; // absent
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[theme.accent, '#34D399']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedView style={styles.headerContent}>
          <ThemedText style={[styles.headerTitle, { color: 'white' }]}>Attendance</ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: 'white', opacity: 0.8 }]}>Track your daily attendance</ThemedText>
        </ThemedView>
      </LinearGradient>

      {/* Check In/Out Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={[styles.checkInCard, { backgroundColor: theme.card }]}> 
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
              colors={isCheckedIn ? [theme.error, '#F87171'] : [theme.accent, '#34D399']}
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
        {/* Confirmation Modal */}
        {showConfirmModal && (
          <ThemedView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
            <ThemedView style={{ backgroundColor: theme.card, borderRadius: 28, padding: 32, width: '90%', shadowColor: theme.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 16 }}>
              <ThemedView style={{ alignItems: 'center', marginBottom: 18 }}>
                <IconSymbol name={pendingClockType === 'in' ? 'clock.badge.checkmark' : 'clock.badge.xmark'} size={48} color={pendingClockType === 'in' ? '#10B981' : '#EF4444'} />
                <ThemedText style={{ fontSize: 22, fontWeight: 'bold', marginTop: 10, color: '#059669', textAlign: 'center', letterSpacing: 0.5 }}>
                 Confirm atensi
                </ThemedText>
              </ThemedView>
              <ThemedView style={{ height: 1, backgroundColor: '#10B981', marginBottom: 18 }} />
              <ThemedView style={{ backgroundColor: '#E6FFF5', borderRadius: 16, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: '#10B981' }}>
                <ThemedText style={{ fontWeight: 'bold', marginBottom: 10, color: '#059669', fontSize: 16, textAlign: 'center' }}>Submission Data</ThemedText>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <ThemedText style={{ fontWeight: 'bold', color: '#059669', fontSize: 15 }}>Status</ThemedText>
                  <ThemedText style={{ color: '#059669', fontSize: 15 }}>{pendingClockType}</ThemedText>
                </ThemedView>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <ThemedText style={{ fontWeight: 'bold', color: '#059669', fontSize: 15 }}>Latitude</ThemedText>
                  <ThemedText style={{ color: '#059669', fontSize: 15 }}>{location ? location.lat.toFixed(6) : '-'}</ThemedText>
                </ThemedView>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <ThemedText style={{ fontWeight: 'bold', color: '#059669', fontSize: 15 }}>Longitude</ThemedText>
                  <ThemedText style={{ color: '#059669', fontSize: 15 }}>{location ? location.lng.toFixed(6) : '-'}</ThemedText>
                </ThemedView>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <ThemedText style={{ fontWeight: 'bold', color: '#059669', fontSize: 15 }}>Location Reason</ThemedText>
                  <ThemedText style={{ color: '#059669', fontSize: 15 }}>{locationReason}</ThemedText>
                </ThemedView>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <ThemedText style={{ fontWeight: 'bold', color: '#059669', fontSize: 15 }}>Client Time</ThemedText>
                  <ThemedText style={{ color: '#059669', fontSize: 15 }}>{(() => {
                    const now = new Date();
                    const pad = (n: number) => n.toString().padStart(2, '0');
                    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
                  })()}</ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedView style={{ marginBottom: 18, alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 15, color: '#059669', textAlign: 'center', marginBottom: 2 }}>
                  Location: {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Unknown'}
                </ThemedText>
                {showLocationInput ? (
                  <ThemedView style={{ marginTop: 10, width: '100%' }}>
                    <ThemedText style={{ marginBottom: 5, color: '#EF4444', fontWeight: 'bold', textAlign: 'center', fontSize: 15 }}>You are outside the office radius.</ThemedText>
                    <ThemedText style={{ marginBottom: 5, color: '#059669', textAlign: 'center', fontSize: 15 }}>Please provide a reason:</ThemedText>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#10B981',
                        borderRadius: 10,
                        padding: 12,
                        backgroundColor: '#F8FAFC',
                        marginBottom: 10,
                        color: '#059669',
                        fontSize: 15,
                        textAlign: 'center',
                      }}
                      placeholder="Enter reason..."
                      placeholderTextColor="#6B7280"
                      value={locationReason}
                      onChangeText={setLocationReason}
                      maxLength={100}
                      autoFocus
                    />
                  </ThemedView>
                ) : (
                  <ThemedText style={{ marginTop: 10, marginBottom: 10, color: '#10B981', textAlign: 'center', fontSize: 15 }}>Within office radius.</ThemedText>
                )}
              </ThemedView>
              <ThemedView style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                <TouchableOpacity onPress={() => setShowConfirmModal(false)} style={{ marginRight: 16, paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10, backgroundColor: '#E6FFF5', shadowColor: '#059669', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 }}>
                  <ThemedText style={{ color: '#059669', fontWeight: 'bold', fontSize: 16 }}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={submitClock} style={{ paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10, backgroundColor: '#10B981', shadowColor: '#10B981', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6 }}>
                  <ThemedText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Confirm</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>

      {/* Quick Stats */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>This Week</ThemedText>
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={[styles.statBox, { backgroundColor: theme.card }]}> 
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
        <ThemedView style={[styles.historyContainer, { backgroundColor: theme.card }]}> 
          {attendanceHistory.length === 0 && loadingHistory ? (
            <ThemedText>Loading...</ThemedText>
          ) : attendanceHistory.length === 0 ? (
            <ThemedText>No attendance records found.</ThemedText>
          ) : (
            <ScrollView
              style={{ maxHeight: 400 }}
              onScroll={({ nativeEvent }) => {
                if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 20) {
                  handleLoadMore();
                }
              }}
              scrollEventThrottle={200}
            >
              {attendanceHistory.map((record, index) => (
                <ThemedView key={index} style={styles.historyItem}>
                  <ThemedView style={styles.historyLeft}>
                    <ThemedView style={[styles.statusDot, { backgroundColor: getStatusColor(record.status) }]} />
                    <ThemedView style={styles.historyInfo}>
                      <ThemedText style={styles.historyDate}>{record.date}</ThemedText>
                      <ThemedText style={styles.historyStatus}>{record.status === 1 ? 'present' : record.status === 2 ? 'late' : 'absent'}</ThemedText>
                      {record.location_reason && (
                        <ThemedText style={styles.locationReason}>{record.location_reason}</ThemedText>
                      )}
                    </ThemedView>
                  </ThemedView>
                  <ThemedView style={styles.historyRight}>
                    <ThemedText style={styles.historyTime}>{record.clock_in_time || '-'} - {record.clock_out_time || '-'}</ThemedText>
                    <ThemedText style={styles.historyHours}>{record.work_hours ? `${record.work_hours}h` : '-'}</ThemedText>
                  </ThemedView>
                </ThemedView>
              ))}
              {loadingHistory && hasMore && (
                <ThemedText style={{ textAlign: 'center', marginTop: 10 }}>Loading more...</ThemedText>
              )}
            </ScrollView>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
};

export default AttendanceScreen;

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
  locationReason: {
    fontSize: 12,
    color: '#6366F1',
    marginTop: 2,
    fontStyle: 'italic',
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
