import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, Text, View } from 'react-native';

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
      <View className="px-4" style={{ gap: 4 }}>
        <Text className="font-inter-semibold text-[22px] leading-[33px] text-[#101828]">
          {title}
        </Text>
        <Text className="font-inter-regular text-[13px] leading-5 text-[#6A7282]">
          {subtitle}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 30, gap: 27 }}
      >
        {collections.map((item) => (
          <View
            key={item.id}
            style={{ width: 132, height: 124, borderRadius: 14, overflow: 'hidden' }}
          >
            <Image source={item.image} style={{ width: 132, height: 124 }} resizeMode="cover" />
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
                borderRadius: 16,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 102,
                alignItems: 'center',
              }}
            >
              <Text className="font-inter-bold text-[16px] leading-4 text-white text-center">
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
