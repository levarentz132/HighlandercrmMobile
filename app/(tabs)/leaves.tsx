import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function LeavesScreen() {
  const [showModal, setShowModal] = useState(false);
  
  const leaveTypes = [
    { id: 2, title: 'Sakit', color: '#F59E0B' },
    { id: 3, title: 'Alpha', color: '#8B5CF6' },
    { id: 4, title: 'Cuti Tahunan', color: '#10B981' },
  ];

  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Form state
  // Always default to a valid leave type (2 = Sakit)
  const [selectedType, setSelectedType] = useState<number>(2);
  const [date, setDate] = useState<string>('');
  const [reason, setReason] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch leave (izin) data from API
  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        const response = await fetch('https://crm.highlander.co.id/api/attendance/izin?per_page=10', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const result = await response.json();
        // ...existing code...
        setLeaveHistory(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        // ...existing code...
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleApplyLeave = () => {
    setSelectedType(2); // Default to Sakit
    setDate('');
    setReason('');
    setShowModal(true);
  };

  const submitLeaveRequest = async () => {
    // Debug log for form values (use 'type' instead of 'selectedType' for clarity)
    if (typeof selectedType !== 'number' || ![2, 3, 4].includes(selectedType) || !date || !reason) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');
      const payload = {
        type: selectedType,
        date,
        reason,
      };
      const response = await fetch('https://crm.highlander.co.id/api/attendance/izin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const resData = await response.json();
      if (resData.success) {
        Alert.alert('Success', resData.message || 'Leave request submitted successfully!');
        setShowModal(false);
        // Refetch leave data
        const refetch = await fetch('https://crm.highlander.co.id/api/attendance/izin?per_page=10', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const refetchResult = await refetch.json();
        setLeaveHistory(Array.isArray(refetchResult.data) ? refetchResult.data : []);
      } else {
        Alert.alert('Error', resData.message || 'Failed to submit leave request.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit leave request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedView style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Izin Sakit / Cuti</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Manage your time off requests</ThemedText>
        </ThemedView>
      </LinearGradient>

      {/* Apply Leave Button */}
      <ThemedView style={styles.section}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyLeave}>
          <LinearGradient
            colors={['#6366F1', '#4F46E5']}
            style={styles.applyGradient}
          >
            <IconSymbol name="calendar.badge.plus" size={24} color="white" />
            <ThemedText style={styles.applyButtonText}>Apply for Izin Sakit / Cuti</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>

      {/* Leave Balance section removed for Sakit, Alpha, Cuti Tahunan */}

      {/* Leave History */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Requests</ThemedText>
        <ThemedView style={styles.historyContainer}>
          {loading ? (
            <ThemedText>Loading...</ThemedText>
          ) : leaveHistory.length === 0 ? (
            <ThemedText>No leave records found.</ThemedText>
          ) : leaveHistory.map((leave) => {
            // Map type and status to readable labels
            let typeLabel = 'Other';
            if (leave.type === 2) typeLabel = 'Sakit';
            else if (leave.type === 3) typeLabel = 'Alpha';
            else if (leave.type === 4) typeLabel = 'Cuti Tahunan';

            let statusLabel = 'pending';
            if (leave.status === 1) statusLabel = 'approved';
            else if (leave.status === 2) statusLabel = 'rejected';

            // Delete handler
            const handleDelete = async () => {
              Alert.alert(
                'Delete Confirmation',
                'Are you sure you want to delete this leave request?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        const token = await AsyncStorage.getItem('auth_token');
                        if (!token) throw new Error('No auth token');
                        const response = await fetch(`https://crm.highlander.co.id/api/attendance/izin/${leave.id}`, {
                          method: 'DELETE',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                          },
                        });
                        const resData = await response.json();
                        if (resData.success) {
                          Alert.alert('Success', resData.message || 'Leave deleted successfully!');
                          // Remove from UI
                          setLeaveHistory((prev) => prev.filter((item) => item.id !== leave.id));
                        } else {
                          Alert.alert('Error', resData.message || 'Failed to delete leave.');
                        }
                      } catch (err: any) {
                        Alert.alert('Error', err.message || 'Failed to delete leave.');
                      }
                    },
                  },
                ]
              );
            };

            return (
              <ThemedView key={leave.id} style={styles.historyItem}>
                <ThemedView style={styles.historyLeft}>
                  <ThemedView style={[styles.statusDot, { backgroundColor: getStatusColor(statusLabel) }]} />
                  <ThemedView style={styles.historyInfo}>
                    <ThemedText style={styles.historyType}>{typeLabel}</ThemedText>
                    <ThemedText style={styles.historyDates}>{leave.date}</ThemedText>
                    <ThemedText style={styles.historyReason}>{leave.location_reason}</ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView style={styles.historyRight}>
                  <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(statusLabel) }]}> 
                    <ThemedText style={styles.statusText}>{statusLabel}</ThemedText>
                  </ThemedView>
                  {/* Delete button, only show if status is pending */}
                  {statusLabel === 'pending' && (
                    <TouchableOpacity onPress={handleDelete} style={{ marginTop: 8 }}>
                      <ThemedText style={{ color: '#EF4444', fontSize: 12 }}>Delete</ThemedText>
                    </TouchableOpacity>
                  )}
                </ThemedView>
              </ThemedView>
            );
          })}
        </ThemedView>
      </ThemedView>

      {/* Apply Leave Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Apply for Leave</ThemedText>
            
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Leave Type</ThemedText>
              {(Array.isArray(leaveTypes) ? leaveTypes : []).map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.formInput, selectedType === type.id && { borderColor: type.color }]}
                  onPress={() => setSelectedType(type.id)}
                  disabled={submitting}
                >
                  <ThemedText style={[styles.inputText, selectedType === type.id && { color: type.color, fontWeight: 'bold' }]}>{type.title}</ThemedText>
                  {selectedType === type.id && <IconSymbol name="checkmark" size={16} color={type.color} />}
                </TouchableOpacity>
              ))}
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Date</ThemedText>
              <TouchableOpacity
                style={styles.formInput}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <ThemedText style={[styles.inputText, { color: date ? '#1F2937' : '#6B7280' }]}> {date ? date : 'Select date'} </ThemedText>
                <IconSymbol name="calendar" size={16} color="#6B7280" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date ? new Date(date) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(
                    event: any,
                    selectedDate?: Date | undefined
                  ) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      // Format to YYYY-MM-DD
                      const yyyy = selectedDate.getFullYear();
                      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                      const dd = String(selectedDate.getDate()).padStart(2, '0');
                      setDate(`${yyyy}-${mm}-${dd}`);
                    }
                  }}
                />
              )}
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Reason</ThemedText>
              <TextInput
                style={[styles.formInput, styles.textArea, { color: '#1F2937', textAlignVertical: 'top' }]}
                placeholder="Enter reason for leave"
                placeholderTextColor="#6B7280"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
              />
            </ThemedView>

            <ThemedView style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton, (submitting || typeof selectedType !== 'number' || ![2,3,4].includes(selectedType)) && { opacity: 0.6 }]} 
                onPress={submitLeaveRequest}
                disabled={submitting || typeof selectedType !== 'number' || ![2,3,4].includes(selectedType)}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.submitGradient}
                >
                  <ThemedText style={styles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit'}</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
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
  applyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  applyGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  balanceGrid: {
    backgroundColor: 'transparent',
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  balanceNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  balanceAvailable: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  balanceUsed: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
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
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'transparent',
  },
  historyLeft: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'transparent',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 6,
  },
  historyInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  historyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyDates: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  historyReason: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontStyle: 'italic',
  },
  historyRight: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  historyDays: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    backgroundColor: 'transparent',
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
  },
  submitButton: {
    marginLeft: 8,
  },
  submitGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
