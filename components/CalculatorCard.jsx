import { ChevronRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

const CalculatorCard = ({ titlePrefix, description, vectorsConfig, onPress }) => {
  return (
    <View 
      style={{
        width: 186,
        height: 215,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.67,
        borderColor: '#D4A574',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
        marginRight: 10,
        marginBottom: 6,
        marginTop: 2
      }}
    >
      <Text 
        className="font-inter-bold"
        style={{
          position: 'absolute',
          left: 13,
          top: 13,
          fontSize: 14,
          lineHeight: 20,
          color: '#8B6F47'
        }}
      >
        {titlePrefix}
      </Text>
      
      <Text 
        className="font-inter-bold"
        style={{
          position: 'absolute',
          left: 13,
          top: 36,
          fontSize: 14,
          lineHeight: 20,
          color: '#8B6F47'
        }}
      >
        Calculator
      </Text>
      
      <Text 
        className="font-inter-regular"
        style={{
          position: 'absolute',
          left: 16.67,
          top: 76.67,
          fontSize: 12,
          lineHeight: 18,
          color: '#6A7282',
          width: 200,
          height: 36
        }}
        numberOfLines={2}
      >
        {description}
      </Text>

      {/* Illustration Container */}
      <View 
        style={{
          position: 'absolute',
          width: 200,
          height: 80,
          left: 16.67,
          top: 124.67
        }}
      >
        {/* Render dynamic vectors passed via config */}
        {vectorsConfig.map((v, i) => (
          <View 
            key={i}
            style={{
              position: 'absolute',
              left: `${v.left}%`,
              right: `${v.right}%`,
              top: `${v.top}%`,
              bottom: `${v.bottom}%`,
              backgroundColor: v.background || 'transparent',
              borderWidth: v.borderWidth || 0,
              borderColor: v.borderColor || 'transparent',
              borderTopLeftRadius: v.roundedTop ? 100 : 0,
              borderTopRightRadius: v.roundedTop ? 100 : 0
            }}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity 
        onPress={onPress}
        style={{
          position: 'absolute',
          width: 36,
          height: 36,
          left: 180.67,
          top: 216.67,
          backgroundColor: '#D4A574',
          borderRadius: 18,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ChevronRight size={20} color="#FFFFFF" strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );
};

export default CalculatorCard;
