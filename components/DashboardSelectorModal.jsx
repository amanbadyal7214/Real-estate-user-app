import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '../app/constants/theme';

const DashboardSelectorModal = ({ visible, roles, onSelect, onClose }) => {
  if (!visible) return null;

  // Filter or unique the roles if there are duplicates or weird strings
  const roleList = Array.isArray(roles) ? roles : [];
  
  // Construct options based on roles present
  const options = [];

  if (roleList.includes('buyer')) {
    options.push({
      key: 'buyer',
      title: 'Buyer Dashboard',
      subtitle: 'Search properties, view trends, compute eligibility',
      iconType: 'ionicons',
      iconName: 'cart-outline',
      bgColor: '#E6F7F6',
      iconColor: PRIMARY_COLOR,
      target: '/screens/Buy/Buy'
    });
  }

  if (roleList.includes('owner')) {
    options.push({
      key: 'owner',
      title: 'Owner Dashboard',
      subtitle: 'Manage your listed properties and post new ads',
      iconType: 'ionicons',
      iconName: 'home-outline',
      bgColor: '#F3E8FF',
      iconColor: '#7C3AED',
      target: '/screens/PostProperty/MyProperties'
    });
  }

  if (roleList.includes('builder')) {
    options.push({
      key: 'builder',
      title: 'Builder Dashboard',
      subtitle: 'Manage projects, construct profiles, add properties',
      iconType: 'ionicons',
      iconName: 'business-outline',
      bgColor: '#FEF3C7',
      iconColor: '#D97706',
      target: '/screens/Project/MyProjects'
    });
  }

  // Fallback if no roles matched but we got something
  if (options.length === 0 && roleList.length > 0) {
    // If user has other roles not mapped
    roleList.forEach((role) => {
      options.push({
        key: role,
        title: `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`,
        subtitle: `Access your account dashboard as ${role}`,
        iconType: 'ionicons',
        iconName: 'person-outline',
        bgColor: '#F3F4F6',
        iconColor: '#4B5563',
        target: role === 'buyer' ? '/screens/Buy/Buy' : '/screens/PostProperty/MyProperties'
      });
    });
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header Drag Indicator */}
          <View style={styles.dragIndicator} />

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              You have multiple dashboards available. Please select one to proceed:
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                activeOpacity={0.7}
                style={[styles.card, { borderColor: opt.iconColor + '20' }]}
                onPress={() => onSelect(opt.target)}
              >
                <View style={[styles.iconContainer, { backgroundColor: opt.bgColor }]}>
                  {opt.iconType === 'ionicons' ? (
                    <Ionicons name={opt.iconName} size={24} color={opt.iconColor} />
                  ) : (
                    <MaterialCommunityIcons name={opt.iconName} size={24} color={opt.iconColor} />
                  )}
                </View>
                
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{opt.title}</Text>
                  <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>
                </View>

                <View style={styles.chevronContainer}>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 25,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  closeButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
  },
});

export default DashboardSelectorModal;
