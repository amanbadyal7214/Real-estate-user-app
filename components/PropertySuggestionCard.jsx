import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PropertySuggestionCard = ({
  image,
  developerName,
  developerInitial,
  price,
  title,
  location,
  config,
  onPress
}) => {
  return (
    <Animated.View entering={FadeInUp.duration(600).delay(300)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.93}
        style={styles.cardContainer}
      >
        <View style={styles.imageBackground}>
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            style={[StyleSheet.absoluteFill, { borderRadius: wp('5.3%') }]}
            contentFit="cover"
            transition={800}
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
            style={styles.fullGradient}
          >
            {/* Developer Badge Container */}
            <View style={styles.devBadge}>
              <LinearGradient
                colors={['#008E96', '#1CB2A9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.initialBubble}
              >
                <Text style={styles.initialText}>{developerInitial}</Text>
              </LinearGradient>
              <Text numberOfLines={1} style={styles.devNameText}>
                {developerName}
              </Text>
            </View>

            {/* Favorite/Heart Button */}
            <View style={styles.favButton}>
              <Heart size={wp('5.3%')} color="#4A5565" strokeWidth={1.5} />
            </View>

            {/* Pricing */}
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>{price}</Text>
            </View>

            {/* Project Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleLabel}>{title}</Text>
            </View>

            {/* Location & Config Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>{location}</Text>
              <Text style={styles.detailText}>{config}</Text>
            </View>

          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: wp('45.3%'),
    height: hp('33.5%'),
    borderRadius: wp('4.5%'),
    overflow: 'hidden',
    marginRight: wp('2.7%'),
  },
  imageBackground: {
    flex: 1,
  },
  fullGradient: {
    flex: 1,
    position: 'relative',
  },
  devBadge: {
    position: 'absolute',
    left: wp('3.7%'),
    top: hp('1.7%'),
    width: wp('27%'),
    height: hp('3.7%'),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: wp('4.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('1.4%'),
  },
  initialBubble: {
    width: wp('5.4%'),
    height: wp('5.4%'),
    borderRadius: wp('2.7%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('1.8%'),
  },
  initialText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: wp('2.7%'),
    lineHeight: hp('1.9%'),
  },
  devNameText: {
    color: '#101828',
    fontWeight: '700',
    fontSize: wp('2.3%'),
    lineHeight: hp('1.7%'),
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    flex: 1,
  },
  favButton: {
    position: 'absolute',
    left: wp('35.3%'),
    top: hp('1.3%'),
    width: wp('8.2%'),
    height: wp('8.2%'),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: wp('4.1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    position: 'absolute',
    left: wp('3.7%'),
    top: hp('22.8%'),
    width: wp('38%'),
  },
  priceLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: wp('4.1%'),
    lineHeight: hp('2.7%'),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  titleContainer: {
    position: 'absolute',
    left: wp('3.7%'),
    top: hp('25.8%'),
    width: wp('38%'),
  },
  titleLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: wp('3.2%'),
    lineHeight: hp('2.1%'),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  detailsContainer: {
    position: 'absolute',
    left: wp('3.7%'),
    top: hp('28.3%'),
    width: wp('38%'),
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    fontSize: wp('2.5%'),
    lineHeight: hp('1.7%'),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
});

export default PropertySuggestionCard;
