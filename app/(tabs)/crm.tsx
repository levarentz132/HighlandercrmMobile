import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function CRMScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const clients = [
    {
      id: 1,
      name: 'Acme Corporation',
      contact: 'John Smith',
      email: 'john@acme.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      value: '$50,000',
      lastContact: '2 days ago',
      avatar: '🏢'
    },
    {
      id: 2,
      name: 'Tech Innovations Ltd',
      contact: 'Sarah Johnson',
      email: 'sarah@techinnovations.com',
      phone: '+1 (555) 987-6543',
      status: 'prospect',
      value: '$75,000',
      lastContact: '1 week ago',
      avatar: '💻'
    },
    {
      id: 3,
      name: 'Green Energy Solutions',
      contact: 'Mike Davis',
      email: 'mike@greenenergy.com',
      phone: '+1 (555) 456-7890',
      status: 'active',
      value: '$120,000',
      lastContact: 'Yesterday',
      avatar: '🌱'
    },
    {
      id: 4,
      name: 'Digital Marketing Pro',
      contact: 'Lisa Wang',
      email: 'lisa@digitalmarketing.com',
      phone: '+1 (555) 321-9876',
      status: 'inactive',
      value: '$25,000',
      lastContact: '2 weeks ago',
      avatar: '📱'
    },
  ];

  const activities = [
    {
      id: 1,
      type: 'call',
      client: 'Acme Corporation',
      description: 'Quarterly review call',
      time: '2 hours ago',
      icon: 'phone.fill' as const
    },
    {
      id: 2,
      type: 'meeting',
      client: 'Tech Innovations Ltd',
      description: 'Product demo meeting',
      time: '1 day ago',
      icon: 'person.2.fill' as const
    },
    {
      id: 3,
      type: 'email',
      client: 'Green Energy Solutions',
      description: 'Project proposal sent',
      time: '2 days ago',
      icon: 'envelope.fill' as const
    },
  ];

  const stats = [
    { label: 'Active Clients', value: '24', color: '#10B981', icon: 'person.3.fill' as const },
    { label: 'Revenue', value: '$2.5M', color: '#F59E0B', icon: 'chart.bar.fill' as const },
    { label: 'Proposals', value: '8', color: '#8B5CF6', icon: 'doc.fill' as const },
    { label: 'Meetings', value: '12', color: '#EF4444', icon: 'calendar' as const },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'prospect': return '#F59E0B';
      case 'inactive': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedView style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>CRM Dashboard</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Manage your client relationships</ThemedText>
        </ThemedView>
      </LinearGradient>

      {/* Stats Cards */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <ThemedView key={index} style={styles.statCard}>
              <LinearGradient
                colors={[stat.color, stat.color + '20']}
                style={styles.statGradient}
              >
                <IconSymbol name={stat.icon} size={24} color={stat.color} />
                <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
              </LinearGradient>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>
      </ThemedView>

      {/* Client List */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Clients</ThemedText>
          <TouchableOpacity style={styles.addButton}>
            <IconSymbol name="plus.circle.fill" size={24} color="#6366F1" />
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.clientList}>
          {filteredClients.map((client) => (
            <TouchableOpacity key={client.id} style={styles.clientCard}>
              <ThemedView style={styles.clientHeader}>
                <ThemedView style={styles.clientAvatar}>
                  <ThemedText style={styles.avatarText}>{client.avatar}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.clientInfo}>
                  <ThemedText style={styles.clientName}>{client.name}</ThemedText>
                  <ThemedText style={styles.clientContact}>{client.contact}</ThemedText>
                </ThemedView>
                <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) }]}>
                  <ThemedText style={styles.statusText}>{client.status}</ThemedText>
                </ThemedView>
              </ThemedView>
              
              <ThemedView style={styles.clientDetails}>
                <ThemedView style={styles.clientRow}>
                  <IconSymbol name="envelope" size={14} color="#6B7280" />
                  <ThemedText style={styles.clientDetailText}>{client.email}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.clientRow}>
                  <IconSymbol name="phone" size={14} color="#6B7280" />
                  <ThemedText style={styles.clientDetailText}>{client.phone}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.clientRow}>
                  <IconSymbol name="dollarsign.circle" size={14} color="#6B7280" />
                  <ThemedText style={styles.clientDetailText}>Value: {client.value}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.clientRow}>
                  <IconSymbol name="clock" size={14} color="#6B7280" />
                  <ThemedText style={styles.clientDetailText}>Last contact: {client.lastContact}</ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.clientActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <IconSymbol name="phone.fill" size={16} color="#10B981" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <IconSymbol name="envelope.fill" size={16} color="#6366F1" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <IconSymbol name="calendar.badge.plus" size={16} color="#F59E0B" />
                </TouchableOpacity>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Recent Activities */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Activities</ThemedText>
        <ThemedView style={styles.activityList}>
          {activities.map((activity) => (
            <ThemedView key={activity.id} style={styles.activityItem}>
              <ThemedView style={styles.activityIcon}>
                <IconSymbol name={activity.icon} size={20} color="#6366F1" />
              </ThemedView>
              <ThemedView style={styles.activityContent}>
                <ThemedText style={styles.activityDescription}>{activity.description}</ThemedText>
                <ThemedText style={styles.activityClient}>{activity.client}</ThemedText>
                <ThemedText style={styles.activityTime}>{activity.time}</ThemedText>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  clientList: {
    backgroundColor: 'transparent',
  },
  clientCard: {
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
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
  },
  clientInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  clientContact: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  clientDetails: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  clientDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  clientActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'transparent',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  activityClient: {
    fontSize: 12,
    color: '#6366F1',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
