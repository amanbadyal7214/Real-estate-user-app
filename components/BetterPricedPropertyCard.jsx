import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { formatPrice } from '../app/utils/formatPrice';

const BetterPricedPropertyCard = ({ id, image, title, marketer, details, priceRange }) => {
  const marketerInitial = marketer ? marketer.charAt(0).toUpperCase() : '';

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => {
        const propId = id
        if (propId) {
          router.push({ pathname: '/screens/PropertyDetails', params: { propertyId: propId } })
        } else {
          router.push('/screens/ProjectDetails')
        }
      }}
      className="bg-white  mr-3"
      style={{
        width: 240,
        height: 275,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ borderRadius: 16, overflow: 'hidden', width: '100%', height: '100%' }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: 160 }}
          resizeMode="cover"
        />
        
        <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 12, gap: 6 }}>
          <Text 
            className="font-inter-bold text-[#101828]" 
            style={{ fontSize: 16, lineHeight: 24 }}
            numberOfLines={1}
          >
            {title}
          </Text>
          
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <View 
              className="items-center justify-center bg-primary"
              style={{ width: 24, height: 24, borderRadius: 12 }}
            >
              <Text 
                className="font-inter-bold text-white text-center" 
                style={{ fontSize: 10, lineHeight: 15 }}
              >
                {marketerInitial}
              </Text>
            </View>
            <Text 
              className="font-inter-regular text-[#6A7282]" 
              style={{ fontSize: 12, lineHeight: 18, flex: 1 }}
              numberOfLines={1}
            >
              mktd by {marketer}
            </Text>
          </View>

          <Text 
            className="font-inter-regular text-[#4A5565]" 
            style={{ fontSize: 12, lineHeight: 18 }}
            numberOfLines={1}
          >
            {details}
          </Text>

          <Text 
            className="font-inter-bold  text-[#101828]" 
            style={{ fontSize: 15, lineHeight: 22 }}
            numberOfLines={1}
          >
           {formatPrice(priceRange)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BetterPricedPropertyCard;
