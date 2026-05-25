import { router } from 'expo-router';
import { ArrowLeft, Building2, ChevronRight, MapPin, Mic, Search, Star } from 'lucide-react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProjectSearch = () => {
  const topDevelopers = [
    { id: 1, name: 'Bajwa Group', projects: 17, initial: 'B' },
    { id: 2, name: 'Janta Land Prom...', projects: 9, initial: 'J' },
  ];

  const trendingProjects = [
    { id: 1, name: 'Amayra Skycity', location: 'Daun Majra, Mohali', price: '₹5.99k/ sq.ft.' },
    { id: 2, name: 'Hero Homes', location: 'Sector 88, Mohali', price: '₹8.81k/ sq.ft.' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 h-[60px]">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => router.push('/screens/Project/Project')} 
            className="w-9 h-9 rounded-full justify-center items-center"
          >
            <ArrowLeft size={20} color="#101828" />
          </TouchableOpacity>
          <Text className="font-inter-semibold text-[18px] color-[#101828]">Project</Text>
        </View>
        <TouchableOpacity className="flex-row items-center gap-1.5">
          <MapPin size={16} color="#008E96" />
          <Text className="font-inter-medium text-[14px] color-[#4A5565]">Mohali</Text>
          <ChevronRight size={16} color="#6A7282" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Search Bar */}
        <View className="px-4 pt-3 mb-5">
          <View className="flex-row items-center px-4 gap-3 h-11 bg-white border-2 border-[#B3DDDF] rounded-[24px]">
            <Search size={20} color="#6A7282" />
            <TextInput
              placeholder="Locality, Landmark, Project..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 font-inter-regular text-[14px] color-[#101828]"
            />
            <TouchableOpacity>
              <Mic size={20} color="#008E96" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Developers Section */}
        <View className="m-3 p-4 bg-[#F1FFFE] rounded-[16px] mb-5">
          <View className="flex-row items-center gap-2 mb-4">
            <Star size={20} color="#101828" />
            <Text className="font-inter-semibold text-[17px] color-[#101828]">Top developers</Text>
          </View>
          <View className="flex-row gap-3">
            {topDevelopers.map((dev) => (
              <TouchableOpacity key={dev.id} className="flex-1 flex-row items-center p-3 bg-white border-[0.67px] border-[#E4E7EC] rounded-[12px] h-[76px] gap-3">
                <View className="w-10 h-10 rounded-full bg-[#F3F4F6] justify-center items-center">
                  <Text className="font-inter-bold text-[16px] color-[#6A7282]">{dev.initial}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-inter-medium text-[15px] color-[#101828] leading-[19px]" numberOfLines={2}>{dev.name}</Text>
                  <Text className="font-inter-medium text-[13px] color-[#6A7282]">{dev.projects} projects</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Projects Section */}
        <View className="mx-4 p-4 bg-[#EDFBFA] rounded-[16px] mb-5">
          <View className="flex-row items-center gap-2 mb-4">
            <Building2 size={20} color="#101828" />
            <Text className="font-inter-semibold text-[17px] color-[#101828]">Trending projects</Text>
          </View>
          <View className="flex-row gap-3">
            {trendingProjects.map((project) => (
              <TouchableOpacity key={project.id} className="flex-1 p-5 bg-white border-[0.67px] border-[#E4E7EC] rounded-[12px] h-[124px]">
                <Text className="font-inter-medium text-[15px] color-[#101828] mb-1">{project.name}</Text>
                <Text className="font-inter-medium text-[13px] color-[#6A7282] mb-2">{project.location}</Text>
                <View className="h-[1px] bg-[#E4E7EC] mb-2" />
                <Text className="font-inter-medium text-[14px] color-[#101828]">{project.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
  {/* Explore Nearby Properties Button */}
        <TouchableOpacity 
          onPress={() => router.push('/screens/Project/Project')}
          className="mx-4 mb-10 p-4 flex-row items-center justify-between bg-[#008E96]/10 border border-[#008E96]/20 rounded-2xl"
        >
          <View className="flex-row items-center gap-3">
            <View className="w-9 h-9 bg-white items-center justify-center rounded-full border border-gray-100">
               <ArrowLeft size={16} color="#008E96" style={{ transform: [{ rotate: '180deg'}] }} />
            </View>
            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[15px] text-[#101828]">Explore nearby properties</Text>
          </View>
          <ChevronRight size={20} color="#008E96" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectSearch;