import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function OvertimeScreen() {
  const [showModal, setShowModal] = useState(false);
  
  const overtimeHistory = [
    {
      id: 1,
      date: 'Aug 4, 2025',
      hours: 3.5,
      reason: 'Project deadline completion',
      status: 'approved',
      rate: '$25/hr',
      total: '$87.50'
    },
    {
      id: 2,
      date: 'Aug 1, 2025',
      hours: 2,
      reason: 'Client emergency support',
      status: 'approved',
      rate: '$25/hr',
      total: '$50.00'
    },
    {
      id: 3,
      date: 'Jul 30, 2025',
      hours: 4,
      reason: 'System maintenance',
      status: 'pending',
      rate: '$25/hr',
      total: '$100.00'
    },
  ];

  const monthlyStats = {
    totalHours: 45.5,
    totalEarnings: 1137.50,
    approvedHours: 38.5,
    pendingHours: 7,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleSubmitOvertime = () => {
    setShowModal(false);
    Alert.alert('Success', 'Overtime request submitted successfully!');
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
          <ThemedText style={styles.headerTitle}>Overtime Management</ThemedText>
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
            <ThemedText style={styles.submitButtonText}>Submit Overtime</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>

      {/* Monthly Overview */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>This Month Overview</ThemedText>
        <ThemedView style={styles.overviewCard}>
          <ThemedView style={styles.overviewRow}>
            <ThemedView style={styles.overviewItem}>
              <ThemedText style={styles.overviewValue}>{monthlyStats.totalHours}h</ThemedText>
              <ThemedText style={styles.overviewLabel}>Total Hours</ThemedText>
            </ThemedView>
            <ThemedView style={styles.overviewItem}>
              <ThemedText style={styles.overviewValue}>${monthlyStats.totalEarnings}</ThemedText>
              <ThemedText style={styles.overviewLabel}>Total Earnings</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.overviewRow}>
            <ThemedView style={styles.overviewItem}>
              <ThemedText style={[styles.overviewValue, { color: '#10B981' }]}>{monthlyStats.approvedHours}h</ThemedText>
              <ThemedText style={styles.overviewLabel}>Approved</ThemedText>
            </ThemedView>
            <ThemedView style={styles.overviewItem}>
              <ThemedText style={[styles.overviewValue, { color: '#F59E0B' }]}>{monthlyStats.pendingHours}h</ThemedText>
              <ThemedText style={styles.overviewLabel}>Pending</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Overtime History */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Overtime</ThemedText>
        <ThemedView style={styles.historyContainer}>
          {overtimeHistory.map((overtime) => (
            <ThemedView key={overtime.id} style={styles.historyItem}>
              <ThemedView style={styles.historyHeader}>
                <ThemedView style={styles.historyLeft}>
                  <ThemedView style={[styles.statusDot, { backgroundColor: getStatusColor(overtime.status) }]} />
                  <ThemedView style={styles.historyInfo}>
                    <ThemedText style={styles.historyDate}>{overtime.date}</ThemedText>
                    <ThemedText style={styles.historyReason}>{overtime.reason}</ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView style={styles.historyRight}>
                  <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(overtime.status) }]}>
                    <ThemedText style={styles.statusText}>{overtime.status}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
              
              <ThemedView style={styles.historyDetails}>
                <ThemedView style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Hours:</ThemedText>
                  <ThemedText style={styles.detailValue}>{overtime.hours}h</ThemedText>
                </ThemedView>
                <ThemedView style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Rate:</ThemedText>
                  <ThemedText style={styles.detailValue}>{overtime.rate}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Total:</ThemedText>
                  <ThemedText style={[styles.detailValue, styles.totalAmount]}>{overtime.total}</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          ))}
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
            
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Date</ThemedText>
              <TouchableOpacity style={styles.formInput}>
                <ThemedText style={styles.inputText}>Select date</ThemedText>
                <IconSymbol name="calendar" size={16} color="#6B7280" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Start Time</ThemedText>
              <TouchableOpacity style={styles.formInput}>
                <ThemedText style={styles.inputText}>Select start time</ThemedText>
                <IconSymbol name="clock" size={16} color="#6B7280" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>End Time</ThemedText>
              <TouchableOpacity style={styles.formInput}>
                <ThemedText style={styles.inputText}>Select end time</ThemedText>
                <IconSymbol name="clock" size={16} color="#6B7280" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Total Hours</ThemedText>
              <ThemedView style={styles.formInput}>
                <ThemedText style={styles.calculatedHours}>3.5 hours</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Reason</ThemedText>
              <TouchableOpacity style={[styles.formInput, styles.textArea]}>
                <ThemedText style={styles.inputText}>Enter reason for overtime</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitModalButton]} 
                onPress={handleSubmitOvertime}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.submitModalGradient}
                >
                  <ThemedText style={styles.submitModalButtonText}>Submit</ThemedText>
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
