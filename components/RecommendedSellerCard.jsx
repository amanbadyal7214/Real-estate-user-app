import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Phone } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

const RecommendedSellerCard = ({ name, experienceYears, propertiesCount, location }) => {
  return (
    <View 
      style={{
        width: 272,
        height: 180,
        borderRadius: 16,
        marginRight: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <LinearGradient
        colors={[
          'rgba(28, 178, 169, 0.97)',
          'rgba(26, 175, 168, 0.62)',
          'rgba(25, 173, 166, 0.68)',
          'rgba(23, 170, 165, 0.73)',
          '#15A8A4',
          '#13A5A2',
          '#11A2A1',
          '#0FA0A0',
          '#0D9D9E',
          '#0B9B9D',
          'rgba(8, 152, 155, 0.42)',
          '#06969A',
          'rgba(4, 147, 153, 0.52)',
          '#029197',
          '#008E96'
        ]}
        locations={[
          0, 0.0714, 0.1429, 0.2143, 0.2857, 0.3571, 0.4286, 
          0.5, 0.5714, 0.6429, 0.7143, 0.7857, 0.8571, 0.9286, 1
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 20,
          padding: 16,
          justifyContent: 'space-between'
        }}
      >
        {/* Top Profile Section */}
        <View className="flex-row items-center">
          <View 
            style={{ 
              width: 48, 
              height: 48, 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ fontSize: 20 }}>👤</Text>
          </View>
          
          <View className="flex-row items-center ml-3">
            <Text className="font-inter-bold text-white text-[15px]">{name}</Text>
            <ChevronRight size={16} color="white" className="ml-1" />
          </View>
        </View>

        {/* Info Section */}
        <View style={{ gap: 8, marginTop: 4 }}>
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <Text className="text-white text-[12px]">
              <Text className="font-inter-bold">{experienceYears} yrs </Text>
              <Text className="font-inter-regular">Experience</Text>
            </Text>
            
            <View style={{ width: 1, height: 16, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
            
            <Text className="text-white text-[12px]">
              <Text className="font-inter-bold">{propertiesCount} </Text>
              <Text className="font-inter-regular">Properties</Text>
            </Text>
          </View>
          
          <Text className="font-inter-regular text-white text-[12px]">{location}</Text>
        </View>

        {/* Button */}
        <TouchableOpacity 
          className="bg-white flex-row items-center justify-center mt-2"
          style={{ width: '100%', height: 38, borderRadius: 9999, gap: 8 }}
        >
          <Phone size={16} color="#008E96" />
          <Text className="font-inter-medium text-[#008E96] text-[13px]">
            Show Contact
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default RecommendedSellerCard;
