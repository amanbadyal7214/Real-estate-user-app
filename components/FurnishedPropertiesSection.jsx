import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import FurnishedPropertyCard from './FurnishedPropertyCard';

const FurnishedPropertiesSection = () => {
  const data = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
      price: '₹ 25,000 / Month',
      title: '2 BHK Fully Furnished Flat',
      location: 'Savitry Towers, Sector 91, Mohali',
      furnishedStatus: 'Fully Furnished',
      area: '2300 sq.ft.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=400',
      price: '₹ 32,000 / Month',
      title: '3 BHK Modern Flat',
      location: 'Hero Homes, Sector 88, Mohali',
      furnishedStatus: 'Fully Furnished',
      area: '1850 sq.ft.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
      price: '₹ 28,500 / Month',
      title: '2 BHK Luxury Apartment',
      location: 'JLPL Falcon View, Sector 66, Mohali',
      furnishedStatus: 'Fully Furnished',
      area: '1550 sq.ft.'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Fully Furnished Properties</Text>
          <Text style={styles.subtitle}>Most sought-after rental properties</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map(item => (
          <FurnishedPropertyCard key={item.id} {...item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    marginTop: 20,
    marginHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 32,
    height: 549,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 25,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    lineHeight: 32,
    color: '#101828',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 24,
    color: '#6A7282',
    marginTop: -4,
  },
  seeAllButton: {
    paddingTop: 5,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#008E96',
  },
  scrollContent: {
    paddingHorizontal: 25,
  }
});

export default FurnishedPropertiesSection;
