import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const disclaimerText =
  'Housing.com is only acting as a marketing partner for this project and is not responsible for any delays, functional issues, or quality concerns. All information provided is for reference only and should be verified independently before making any investment decisions.';

const ProjectDisclaimerCard = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View 
      className="bg-white rounded-[16px] p-4 gap-4 w-full"
      style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2 
      }}
    >
      <Text
        className="font-normal text-[#6A7282] text-[12px] leading-[20px]"
        numberOfLines={expanded ? undefined : 4}
      >
        {disclaimerText}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setExpanded((prev) => !prev)}
      >
        <Text className="font-medium text-[#101828] text-[14px] underline">
          {expanded ? 'Hide disclaimer' : 'Read disclaimer'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectDisclaimerCard;