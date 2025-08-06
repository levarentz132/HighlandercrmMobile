import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function OvertimeScreen() {
  // Helper to format ISO date string (with or without sub-milliseconds/Z) to 'YYYY-MM-DD HH:mm'
  const formatDate = (iso: string) => {
    if (!iso) return '';
    let cleanIso = iso;
    if (iso.includes('.')) {
      cleanIso = iso.replace(/\.[0-9]+Z$/, 'Z');
    }
    const d = new Date(cleanIso);
    if (isNaN(d.getTime())) return iso;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };
  const [showModal, setShowModal] = useState(false);
  const [overtimeHistory, setOvertimeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<'leave' | 'overtime'>('overtime');
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState('');
  const [monthlyStats, setMonthlyStats] = useState({
    overtimeTotal: 0,
    overtimePending: 0,
    permitTotal: 0,
    permitPending: 0,
  });
  // Fetch overtime data from API
  useEffect(() => {
    const fetchOvertime = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        const response = await fetch('https://crm.highlander.co.id/api/leave-overtime?per_page=10', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const result = await response.json();
        // Laravel paginator: result.data is array, result.total, result.current_page, etc.
        const dataArr = Array.isArray(result.data) ? result.data : (result.data?.data || []);
        setOvertimeHistory(dataArr);
        // Calculate stats: how many overtime and permit submitted, and how many are pending
        let overtimeTotal = 0, overtimePending = 0, permitTotal = 0, permitPending = 0;
        dataArr.forEach((item: any) => {
          if (item.type === 'overtime') {
            overtimeTotal++;
            if (item.status === 'pending') overtimePending++;
          } else if (item.type === 'leave' || item.type === 'permit') {
            permitTotal++;
            if (item.status === 'pending') permitPending++;
          }
        });
        setMonthlyStats({ overtimeTotal, overtimePending, permitTotal, permitPending });
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchOvertime();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Helper to format time to HH:mm
  const formatTime = (dateObj: Date) => {
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const mm = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  // Calculate hours difference
  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return '';
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let diff = (eh + em / 60) - (sh + sm / 60);
    if (diff < 0) diff += 24; // handle overnight
    return diff.toFixed(2);
  };

  const handleSubmitOvertime = async () => {
    if (!type || !date || !reason) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');
      const payload = {
        type,
        date,
        reason,
      };
      const response = await fetch('https://crm.highlander.co.id/api/leave-overtime', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const resData = await response.json();
      if (response.status === 201) {
        Alert.alert('Success', 'Request submitted successfully!');
        setShowModal(false);
        // Refetch overtime data
        const refetch = await fetch('https://crm.highlander.co.id/api/leave-overtime?per_page=10', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const refetchResult = await refetch.json();
        const dataArr = Array.isArray(refetchResult.data) ? refetchResult.data : (refetchResult.data?.data || []);
        setOvertimeHistory(dataArr);
      } else {
        Alert.alert('Error', resData.message || 'Failed to submit request.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedView style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Lembur & Dinas Management</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Track and request overtime hours</ThemedText>
        </ThemedView>
      </LinearGradient>

      {/* Submit Overtime Button */}
      <ThemedView style={styles.section}>
        <TouchableOpacity style={styles.submitButton} onPress={() => setShowModal(true)}>
          <LinearGradient
            colors={['#6366F1', '#4F46E5']}
            style={styles.submitGradient}
          >
            <IconSymbol name="plus.circle.fill" size={24} color="white" />
            <ThemedText style={styles.submitButtonText}>Submit Lembur / Dinas</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>

      {/* Overtime History */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Overtime</ThemedText>
        <ThemedView style={styles.historyContainer}>
          {loading ? (
            <ThemedText>Loading...</ThemedText>
          ) : overtimeHistory.length === 0 ? (
            <ThemedText>No overtime records found.</ThemedText>
          ) : overtimeHistory.map((overtime) => {
            const handleDelete = async () => {
              Alert.alert(
                'Delete Confirmation',
                'Are you sure you want to delete this overtime request?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        const token = await AsyncStorage.getItem('auth_token');
                        if (!token) throw new Error('No auth token');
                        const response = await fetch(`https://crm.highlander.co.id/api/leave-overtime/${overtime.id}`, {
                          method: 'DELETE',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                          },
                        });
                        const resData = await response.json();
                        if (response.ok) {
                          Alert.alert('Success', resData.message || 'Overtime deleted successfully!');
                          setOvertimeHistory((prev) => prev.filter((item) => item.id !== overtime.id));
                        } else {
                          Alert.alert('Error', resData.message || 'Failed to delete overtime.');
                        }
                      } catch (err: any) {
                        Alert.alert('Error', err.message || 'Failed to delete overtime.');
                      }
                    },
                  },
                ]
              );
            };
            return (
              <ThemedView key={overtime.id} style={styles.historyItem}>
                <ThemedView style={styles.historyHeader}>
                  <ThemedView style={styles.historyLeft}>
                    <ThemedView style={[styles.statusDot, { backgroundColor: getStatusColor(overtime.status) }]} />
                    <ThemedView style={styles.historyInfo}>
                      <ThemedText style={styles.historyDate}>{formatDate(overtime.date)}</ThemedText>
                      <ThemedText style={styles.historyReason}>{overtime.reason}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView style={styles.historyRight}>
                    <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(overtime.status) }]}>
                      <ThemedText style={styles.statusText}>{overtime.status}</ThemedText>
                    </ThemedView>
                    {overtime.status === 'pending' && (
                      <TouchableOpacity onPress={handleDelete} style={{ marginTop: 8 }}>
                        <ThemedText style={{ color: '#EF4444', fontSize: 12 }}>Delete</ThemedText>
                      </TouchableOpacity>
                    )}
                  </ThemedView>
                </ThemedView>
                <ThemedView style={styles.historyDetails}>
                  <ThemedView style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Type:</ThemedText>
                    <ThemedText style={styles.detailValue}>{overtime.type || '-'}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Reason:</ThemedText>
                    <ThemedText style={styles.detailValue}>{overtime.reason}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Status:</ThemedText>
                    <ThemedText style={styles.detailValue}>{overtime.status}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            );
          })}
        </ThemedView>
      </ThemedView>

      {/* Submit Overtime Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Submit Overtime Request</ThemedText>
            {/* Type Picker */}
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Type</ThemedText>
              <ThemedView style={{ flexDirection: 'row', gap: 8 , backgroundColor: 'white'}}>
                <TouchableOpacity
                  style={[
                    styles.formInput,
                    {
                      flex: 1,
                      borderColor: type === 'leave' ? '#8B5CF6' : '#E5E7EB',
                      backgroundColor: 'white',
                    },
                  ]}
                  onPress={() => setType('leave')}
                  disabled={submitting}
                  activeOpacity={0.85}
                >
                  <ThemedText style={[
                    styles.inputText,
                    {
                      color: type === 'leave' ? '#7C3AED' : '#6B7280',
                      fontWeight: type === 'leave' ? 'bold' : 'normal',
                    },
                  ]}>Dinas</ThemedText>
                  {type === 'leave' && <IconSymbol name="checkmark" size={16} color="#7C3AED" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.formInput,
                    {
                      flex: 1,
                      borderColor: type === 'overtime' ? '#8B5CF6' : '#E5E7EB',
                      backgroundColor: 'white',
                    },
                  ]}
                  onPress={() => setType('overtime')}
                  disabled={submitting}
                  activeOpacity={0.85}
                >
                  <ThemedText style={[
                    styles.inputText,
                    {
                      color: type === 'overtime' ? '#7C3AED' : '#6B7280',
                      fontWeight: type === 'overtime' ? 'bold' : 'normal',
                    },
                  ]}>Lembur</ThemedText>
                  {type === 'overtime' && <IconSymbol name="checkmark" size={16} color="#7C3AED" />}
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
            {/* Date Picker */}
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Date</ThemedText>
              <TouchableOpacity style={styles.formInput} onPress={() => setShowDatePicker(true)}>
                <ThemedText style={styles.inputText}>{date ? date : 'Select date'}</ThemedText>
                <IconSymbol name="calendar" size={16} color="#6B7280" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date ? new Date(date) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event: any, selectedDate?: Date | undefined) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const yyyy = selectedDate.getFullYear();
                      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                      const dd = String(selectedDate.getDate()).padStart(2, '0');
                      setDate(`${yyyy}-${mm}-${dd}`);
                    }
                  }}
                />
              )}
            </ThemedView>
            {/* Reason */}
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Reason</ThemedText>
              <TextInput
                style={[styles.formInput, styles.textArea, { color: '#1F2937', textAlignVertical: 'top' }]}
                placeholder="Enter reason for overtime"
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
                style={[styles.modalButton, styles.submitModalButton, submitting && { opacity: 0.6 }]} 
                onPress={handleSubmitOvertime}
                disabled={submitting}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.submitModalGradient}
                >
                  <ThemedText style={styles.submitModalButtonText}>{submitting ? 'Submitting...' : 'Submit'}</ThemedText>
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
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  submitGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  overviewItem: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  overviewLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  historyContainer: {
    backgroundColor: 'transparent',
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyReason: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  historyRight: {
    backgroundColor: 'transparent',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  historyDetails: {
    backgroundColor: 'transparent',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: 'transparent',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#8B5CF6',
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
  calculatedHours: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
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
  submitModalButton: {
    marginLeft: 8,
  },
  submitModalGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitModalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
