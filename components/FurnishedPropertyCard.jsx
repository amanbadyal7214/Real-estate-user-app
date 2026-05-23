import { Image, StyleSheet, Text, View } from 'react-native';

const FurnishedPropertyCard = ({ image, price, title, location, furnishedStatus, area }) => {
  return (
    <View style={styles.card}>
      {/* Property Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: image }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.price}>{price}</Text>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <Text numberOfLines={2} style={styles.location}>{location}</Text>
        
        <View style={styles.footer}>
          <Text style={styles.footerBold}>{furnishedStatus}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.footerBold}>{area}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 301,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.67,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    marginRight: 10,
  },
  imageContainer: {
    width: 145,
    height: 144,
    marginTop: 16,
    marginLeft: 13,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    marginTop: 15,
    paddingHorizontal: 22, // Adjusted to match the visual alignment
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    lineHeight: 28,
    color: '#101828',
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 24,
    color: '#364153',
    marginTop: -4,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 20,
    color: '#6A7282',
    marginTop: 4,
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  footerBold: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    lineHeight: 20,
    color: '#101828',
  },
  dot: {
    marginHorizontal: 8,
    color: '#99A1AF',
    fontSize: 16,
  }
});

export default FurnishedPropertyCard;
