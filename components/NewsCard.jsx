import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const NewsCard = ({ image, title, meta, description }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      className="bg-white"
      style={{
        marginRight: wp('4.3%'),
        marginBottom: hp('1%'),
        marginTop: hp('0.5%'),
        width: wp('65%'),
        borderRadius: wp('3.8%'),
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.4%') },
        shadowOpacity: 0.08,
        shadowRadius: wp('1.1%'),
        elevation: 3,
        overflow: 'hidden'
      }}
    >
      <View style={{ width: '100%', height: hp('15%') }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      
      <View className="px-3.5 py-3.5">
        <Text 
          className="font-bold text-[#101828] text-[14px] leading-[20px] mb-1" 
          numberOfLines={2}
        >
          {title}
        </Text>
        
        <Text 
          className="font-normal text-[#6A7282] text-[11px] leading-[16px] mb-1.5" 
        >
          {meta}
        </Text>
        
        <Text 
          className="font-normal text-[#4A5565] text-[12px] leading-[18px]" 
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
