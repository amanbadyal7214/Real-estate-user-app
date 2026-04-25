import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';

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
            source={image}
            style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
            contentFit="cover"
            transition={800}
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
            style={styles.fullGradient}
          >
            {/* Developer Badge Container - Positioned precisely at 16,16 */}
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

            {/* Favorite/Heart Button - Positioned precisely at 224,16 */}
            <View style={styles.favButton}>
              <Heart size={20} color="#4A5565" strokeWidth={1.5} />
            </View>

            {/* Pricing - Positioned precisely at 20, 292.5 */}
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>{price}</Text>
            </View>

            {/* Project Title - Positioned precisely at 20, 328.5 */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleLabel}>{title}</Text>
            </View>

            {/* Location & Config Details - Positioned precisely at 20, 358 */}
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
    width: 280,
    height: 420,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
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
    left: 16,
    top: 16,
    width: 164.1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  initialBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  initialText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    lineHeight: 21,
  },
  devNameText: {
    color: '#101828',
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  favButton: {
    position: 'absolute',
    left: 224,
    top: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    position: 'absolute',
    left: 20,
    top: 292.5,
    width: 240,
  },
  priceLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    lineHeight: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  titleContainer: {
    position: 'absolute',
    left: 20,
    top: 328.5,
    width: 240,
  },
  titleLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  detailsContainer: {
    position: 'absolute',
    left: 20,
    top: 358,
    width: 240,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 21,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
});

export default PropertySuggestionCard;
