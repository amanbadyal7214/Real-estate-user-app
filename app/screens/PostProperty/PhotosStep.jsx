import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const PhotosStep = () => {
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [images, setImages] = useState([]);

  const recommendations = [
    'Living Room',
    'Bedrooms (all)',
    'Kitchen',
    'Bathrooms',
    'Balcony/View',
    'Building Exterior',
  ];

  const photoTips = [
    { title: 'Good Lighting', desc: 'Take photos in natural daylight', emoji: '☀️' },
    { title: 'Wide Angle', desc: 'Capture the full room view', emoji: '📐' },
    { title: 'Clean Space', desc: 'Tidy up before shooting', emoji: '🧹' },
    { title: 'Multiple Angles', desc: 'Show different perspectives', emoji: '📸' },
  ];

  const toggleRecommendation = (item) => {
    if (selectedRecommendations.includes(item)) {
      setSelectedRecommendations(selectedRecommendations.filter((i) => i !== item));
    } else {
      setSelectedRecommendations([...selectedRecommendations, item]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 pt-6 gap-5">
        {/* Selected Images Preview */}
        {images.length > 0 && (
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-[16px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>
                Selected Photos ({images.length})
              </Text>
              <TouchableOpacity onPress={() => setImages([])}>
                <Text className="text-[12px] text-red-500" style={{ fontFamily: 'Inter-Medium' }}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
              {images.map((img, index) => (
                <View key={index} className="relative">
                  <Image 
                    source={{ uri: img.uri }} 
                    className="w-24 h-24 rounded-xl border border-[#E5E7EB]" 
                  />
                  <TouchableOpacity 
                    className="absolute -top-1 -right-1 bg-white rounded-full shadow-sm"
                    onPress={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <Ionicons name="close-circle" size={20} color="#6A7282" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Photo Tips Card */}
        <LinearGradient
          colors={['#E6F7F6', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4 rounded-[14px] border border-[#008E96]/20"
        >
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center gap-2">
              <View className="w-[18px] h-[18px] items-center justify-center">
                <Ionicons name="sparkles" size={16} color="#008E96" />
              </View>
              <Text className="text-sm text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Photo Tips for Best Results</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="close" size={16} color="#99A1AF" />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            {photoTips.map((tip, index) => (
              <View key={index} className="w-[48%] bg-white p-3 rounded-[10px] border border-[#F3F4F6] h-[105px]">
                <Text className="text-xl mb-1">{tip.emoji}</Text>
                <Text className="text-[12px] text-[#101828] mb-1" style={{ fontFamily: 'Inter-SemiBold' }}>{tip.title}</Text>
                <Text className="text-[10px] text-[#6A7282] leading-[15px]" style={{ fontFamily: 'Inter-Regular' }}>{tip.desc}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Info Banner */}
        <View className="bg-[#EFF6FF] p-3 rounded-[14px] border border-[#BEDBFF] flex-row items-center gap-2">
          <Ionicons name="information-circle-outline" size={16} color="#155DFC" />
          <Text className="text-[12px] text-[#364153] flex-1" style={{ fontFamily: 'Inter-Regular' }}>
            Upload <Text style={{ fontFamily: 'Inter-SemiBold' }}>5-10 high-quality photos</Text> to get 3x more responses
          </Text>
        </View>

        {/* Upload From Gallery */}
        <View className="border-2 border-dashed border-[#D1D5DC] rounded-[16px] p-[34px] items-center">
          <View className="relative">
            <LinearGradient colors={['#008E96', '#1CB2A9']} className="w-20 h-20 rounded-[16px] items-center justify-center">
              <Ionicons name="images" size={36} color="white" />
            </LinearGradient>
            <View className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#1CB2A9] items-center justify-center border-2 border-white">
              <Ionicons name="add" size={16} color="white" />
            </View>
          </View>
          <View className="mt-4 gap-1 items-center">
            <Text className="text-[18px] text-[#101828] text-center" style={{ fontFamily: 'Inter-Bold' }}>Upload from Gallery</Text>
            <Text className="text-[14px] text-[#6A7282] text-center" style={{ fontFamily: 'Inter-Regular' }}>Choose existing photos from your device</Text>
          </View>
          <TouchableOpacity 
            className="mt-6 bg-[#008E96] px-5 py-3 rounded-[14px] w-[155px]"
            onPress={pickImage}
          >
            <Text className="text-[16px] text-white text-center" style={{ fontFamily: 'Inter-SemiBold' }}>Browse Photos</Text>
          </TouchableOpacity>
          <Text className="mt-4 text-[12px] text-[#99A1AF] text-center" style={{ fontFamily: 'Inter-Regular' }}>JPEG, PNG • Max 10MB per photo</Text>
        </View>

        {/* OR Separator */}
        <View className="flex-row items-center">
          <View className="flex-1 h-[0.67px] bg-[#E5E7EB]" />
          <View className="px-4">
            <Text className="text-[14px] text-[#6A7282]" style={{ fontFamily: 'Inter-Medium' }}>OR</Text>
          </View>
          <View className="flex-1 h-[0.67px] bg-[#E5E7EB]" />
        </View>

        {/* Click Live Photos */}
        <View className="border-2 border-dashed border-[#D1D5DC] rounded-[16px] p-[34px] items-center">
          <View className="relative">
            <LinearGradient colors={['#AD46FF', '#9810FA']} className="w-20 h-20 rounded-[16px] items-center justify-center">
              <Ionicons name="camera" size={36} color="white" />
            </LinearGradient>
            <View className="absolute bottom-[-10px] -right-1 w-8 h-8 rounded-full bg-[#9810FA]/60 items-center justify-center border-2 border-white">
              <Text>📸</Text>
            </View>
          </View>
          <View className="mt-4 gap-1 items-center">
            <Text className="text-[18px] text-[#101828] text-center" style={{ fontFamily: 'Inter-Bold' }}>Click Live Photos</Text>
            <Text className="text-[14px] text-[#6A7282] text-center" style={{ fontFamily: 'Inter-Regular' }}>Take photos directly with your camera</Text>
          </View>
          <TouchableOpacity 
            className="mt-6 bg-[#9810FA] px-5 py-3 rounded-[14px] w-[155px]"
            onPress={takePhoto}
          >
            <Text className="text-[16px] text-white text-center" style={{ fontFamily: 'Inter-SemiBold' }}>Open Camera</Text>
          </TouchableOpacity>
          <View className="mt-4 bg-[#FFFBEB] border border-[#FEE685] rounded-[10px] px-3 py-1.5 flex-row items-center">
            <Text className="text-[12px] text-[#BB4D00]" style={{ fontFamily: 'Inter-Regular' }}>📍 Please be inside the property</Text>
          </View>
        </View>

        {/* Recommended Photos Section */}
        <View className="bg-white border border-[#E5E7EB] rounded-[14px] p-5 gap-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle-outline" size={18} color="#008E96" />
            <Text className="text-[18px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Recommended Photos</Text>
          </View>
          <View className="gap-3">
            {recommendations.map((item, index) => (
              <TouchableOpacity key={index} className="flex-row items-center gap-3" onPress={() => toggleRecommendation(item)}>
                <View className={`w-5 h-5 border rounded-sm items-center justify-center ${selectedRecommendations.includes(item) ? 'bg-[#008E96] border-[#008E96]' : 'border-[#6A7282]'}`}>
                  {selectedRecommendations.includes(item) && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text className="text-[14px] text-[#364153]" style={{ fontFamily: 'Inter-Medium' }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Photo Guidelines */}
        <View className="bg-[#F9FAFB] rounded-[14px] p-4 gap-2 mb-10">
          <Text className="text-[12px] uppercase text-[#364153]" style={{ fontFamily: 'Inter-SemiBold' }}>Photo Guidelines</Text>
          <View className="gap-1.5">
            {[
              'Minimum 5 photos required',
              'Clear, well-lit images work best',
              'Avoid watermarks or personal items',
              'Landscape orientation preferred'
            ].map((guideline, index) => (
              <View key={index} className="flex-row items-center gap-3.5">
                <View className="w-1.5 h-1.5 rounded-full bg-[#008E96]" />
                <Text className="text-[12px] text-[#4A5565]" style={{ fontFamily: 'Inter-Regular' }}>{guideline}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PhotosStep;
