import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, Eye, Phone, Search } from 'lucide-react-native';

const ActivityTabs = ({ activeTab = 'saved', onTabPress }) => {
  const tabs = [
    { 
      id: 'saved', 
      label1: 'Saved', 
      label2: 'Properties', 
      icon: Heart, 
      count: '00' 
    },
    { 
      id: 'seen', 
      label1: 'Seen', 
      label2: 'Properties', 
      icon: Eye, 
      count: '03' 
    },
    { 
      id: 'contacted', 
      label1: 'Contacted', 
      label2: 'Properties', 
      icon: Phone, 
      count: '00' 
    },
    { 
      id: 'recent', 
      label1: 'Recent', 
      label2: 'Searches', 
      icon: Search, 
      count: '10' 
    },
  ];

  return (
    <View className="flex-row border-b border-[#E4E7EC] h-[103.67px] bg-white">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress?.(tab.id)}
            className="flex-1 items-center justify-center relative"
            activeOpacity={0.7}
            style={{ width: 98.25 }} // Total width 393px / 4 tabs
          >
            {/* Icon Container */}
            <View className="relative mb-1">
                <View 
                  className={`w-[48px] h-[48px] items-center justify-center ${
                    isActive ? 'bg-[#008E961A]' : 'bg-transparent'
                  }`}
                  style={{ borderRadius: 24 }}
                >
                  <Icon 
                    size={24} 
                    color={isActive ? "#008E96" : "#6A7282"} 
                    strokeWidth={1.5} 
                  />
                </View>

                {/* Badge */}
                <View 
                  className={`absolute -right-2 -top-1 w-[30px] h-[30px] items-center justify-center ${
                    isActive ? 'bg-[#008E96]' : 'bg-[#E4E7EC]'
                  }`}
                  style={{ borderRadius: 15 }}
                >
                  <Text 
                    className={`text-[12px] font-bold text-center ${
                      isActive ? 'text-white' : 'text-[#6A7282]'
                    }`}
                    style={{ fontFamily: 'Inter-SemiBold' }}
                  >
                    {tab.count}
                  </Text>
                </View>
              </View>
              
              {/* Labels */}
              <View className="items-center">
                <Text 
                  className={`text-[14px] font-medium leading-[18px] text-center ${
                    isActive ? 'text-[#101828]' : 'text-[#6A7282]'
                  }`}
                  style={{ fontFamily: 'Inter-Medium' }}
                >
                  {tab.label1}
                </Text>
                <Text 
                  className={`text-[14px] font-medium leading-[18px] text-center ${
                    isActive ? 'text-[#101828]' : 'text-[#6A7282]'
                  }`}
                  style={{ fontFamily: 'Inter-Medium' }}
                >
                  {tab.label2}
                </Text>
              </View>

              {/* Active Indicator */}
              {isActive && (
                <View 
                  className="absolute bottom-[-1px] w-full h-[3px] bg-[#008E96]" 
                  style={{ borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
                />
              )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ActivityTabs;
