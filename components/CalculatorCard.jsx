import { ChevronRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

const CalculatorCard = ({ titlePrefix, description, vectorsConfig = [], onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      style={{
        width: 186,
        height: 240,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.8,
        borderColor: '#D4A574',
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        marginRight: 12,
        padding: 16,
        paddingBottom: 20,
        overflow: 'visible'
      }}
    >
      <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: '#8B6F47', lineHeight: 20 }}>{titlePrefix}</Text>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 14, color: '#8B6F47', marginTop: 2 }}>Calculator</Text>
      </View>

      <Text numberOfLines={2} style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: '#6A7282', marginTop: 12, minHeight: 34 }}>
        {description}
      </Text>

      <View style={{ height: 86, marginTop: 8, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        {/* Oval background */}
        <View
          style={{
            position: 'absolute',
            width: 150,
            height: 64,
            borderRadius: 40,
            backgroundColor: '#FCEFE2',
            bottom: 2,
            alignSelf: 'center'
          }}
        />
          {vectorsConfig.map((v, i) => {
          const left = v.left !== undefined ? (typeof v.left === 'number' ? `${v.left}%` : v.left) : undefined;
          const top = v.top !== undefined ? (typeof v.top === 'number' ? `${v.top}%` : v.top) : undefined;
          const right = v.right !== undefined ? (typeof v.right === 'number' ? `${v.right}%` : v.right) : undefined;
          const bottom = v.bottom !== undefined ? (typeof v.bottom === 'number' ? `${v.bottom}%` : v.bottom) : undefined;

          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left,
                top,
                right,
                bottom,
                backgroundColor: v.background || 'transparent',
                borderWidth: v.borderWidth || 0,
                borderColor: v.borderColor || 'transparent',
                borderRadius: v.rounded ? 8 : 0,
                width: v.width || undefined,
                height: v.height || undefined,
              }}
            />
          );
        })}
      </View>
      <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#D4A574',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3
          }}
        >
          <ChevronRight size={16} color="#FFFFFF" strokeWidth={1.5} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CalculatorCard;
