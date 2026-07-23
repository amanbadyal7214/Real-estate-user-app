import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, Text, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.max(132, width * 0.32);
const CARD_HEIGHT = CARD_WIDTH * 0.94; // roughly 124/132 aspect ratio

const defaultCollections = [
  {
    id: 1,
    title: 'East facing Plots',
    image: { uri: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200' },
  },
  {
    id: 2,
    title: 'East facing Plots',
    image: { uri: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=1200' },
  },
];

const FeaturedCollectionCard = ({
  title = 'Featured Collections',
  subtitle = 'Catagory suited for your property needs',
  collections = defaultCollections,
}) => {
  return (
    <View style={{ gap: 12 }}>
      <View className="px-4 sm:px-6" style={{ gap: 4 }}>
        <Text className="font-semibold text-[22px] sm:text-[26px] leading-[33px] text-[#101828]">
          {title}
        </Text>
        <Text className="font-normal text-[13px] sm:text-[15px] leading-5 text-[#6A7282]">
          {subtitle}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
      >
        {collections.map((item) => (
          <View
            key={item.id}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 14, overflow: 'hidden' }}
          >
            <Image source={item.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            <LinearGradient
              colors={['rgba(229, 167, 22, 0.55)', 'rgba(127, 92, 12, 0.55)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 14,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 12,
                alignItems: 'center',
                paddingHorizontal: 8,
              }}
            >
              <Text 
                numberOfLines={2} 
                className="font-bold text-[14px] sm:text-[16px] text-white text-center"
              >
                {item.title}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedCollectionCard;
