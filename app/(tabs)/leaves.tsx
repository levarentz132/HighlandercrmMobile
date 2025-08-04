import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function LeavesScreen() {
  const [showModal, setShowModal] = useState(false);
  
  const leaveTypes = [
    { id: 1, title: 'Annual Leave', available: 15, used: 5, color: '#10B981' },
    { id: 2, title: 'Sick Leave', available: 10, used: 2, color: '#F59E0B' },
    { id: 3, title: 'Personal Leave', available: 5, used: 1, color: '#8B5CF6' },
    { id: 4, title: 'Emergency Leave', available: 3, used: 0, color: '#EF4444' },
  ];

  const leaveHistory = [
    { 
      id: 1, 
      type: 'Annual Leave', 
      dates: 'Aug 10-12, 2025', 
      days: 3, 
      status: 'approved',
      reason: 'Family vacation'
    },
    { 
      id: 2, 
      type: 'Sick Leave', 
      dates: 'Jul 25, 2025', 
      days: 1, 
      status: 'approved',
      reason: 'Medical appointment'
    },
    { 
      id: 3, 
      type: 'Personal Leave', 
      dates: 'Jul 15, 2025', 
      days: 1, 
      status: 'pending',
      reason: 'Personal matters'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleApplyLeave = () => {
    setShowModal(true);
  };

  const submitLeaveRequest = () => {
    setShowModal(false);
    Alert.alert('Success', 'Leave request submitted successfully!');
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
          <ThemedText style={styles.headerTitle}>Leave Management</ThemedText>
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
            <ThemedText style={styles.applyButtonText}>Apply for Leave</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>

      {/* Leave Balance */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Leave Balance</ThemedText>
        <ThemedView style={styles.balanceGrid}>
          {leaveTypes.map((leave) => (
            <ThemedView key={leave.id} style={[styles.balanceCard, { borderLeftColor: leave.color }]}>
              <ThemedText style={styles.balanceTitle}>{leave.title}</ThemedText>
              <ThemedView style={styles.balanceNumbers}>
                <ThemedText style={styles.balanceAvailable}>
                  {leave.available - leave.used} left
                </ThemedText>
                <ThemedText style={styles.balanceUsed}>
                  {leave.used} used of {leave.available}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.progressBar}>
                <ThemedView 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${(leave.used / leave.available) * 100}%`,
                      backgroundColor: leave.color 
                    }
                  ]} 
                />
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Leave History */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Requests</ThemedText>
        <ThemedView style={styles.historyContainer}>
          {leaveHistory.map((leave) => (
            <ThemedView key={leave.id} style={styles.historyItem}>
              <ThemedView style={styles.historyLeft}>
                <ThemedView style={[styles.statusDot, { backgroundColor: getStatusColor(leave.status) }]} />
                <ThemedView style={styles.historyInfo}>
                  <ThemedText style={styles.historyType}>{leave.type}</ThemedText>
                  <ThemedText style={styles.historyDates}>{leave.dates}</ThemedText>
                  <ThemedText style={styles.historyReason}>{leave.reason}</ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.historyRight}>
                <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(leave.status) }]}>
                  <ThemedText style={styles.statusText}>{leave.status}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.historyDays}>{leave.days} day{leave.days > 1 ? 's' : ''}</ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
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
              <TouchableOpacity style={styles.formInput}>
                <ThemedText style={styles.inputText}>Select leave type</ThemedText>
                <IconSymbol name="chevron.down" size={16} color="#6B7280" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Start Date</ThemedText>
              <TouchableOpacity style={styles.formInput}>
                <ThemedText style={styles.inputText}>Select start date</ThemedText>
                <IconSymbol name="calendar" size={16} color="#6B7280" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>End Date</ThemedText>
              <TouchableOpacity style={styles.formInput}>
                <ThemedText style={styles.inputText}>Select end date</ThemedText>
                <IconSymbol name="calendar" size={16} color="#6B7280" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Reason</ThemedText>
              <TouchableOpacity style={[styles.formInput, styles.textArea]}>
                <ThemedText style={styles.inputText}>Enter reason for leave</ThemedText>
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
                style={[styles.modalButton, styles.submitButton]} 
                onPress={submitLeaveRequest}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.submitGradient}
                >
                  <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
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
