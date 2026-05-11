import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { usePostProperty } from '../../context/PostPropertyContext';

const PhotosStep = () => {
  const { postData, updatePhotos } = usePostProperty();
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [images, setImages] = useState(postData.photos || []);

  useEffect(() => {
    updatePhotos(images);
  }, [images]);

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

        {/* Upload Options */}
        <View className="flex-row gap-4">
          <TouchableOpacity 
            onPress={takePhoto}
            className="flex-1 h-32 border-2 border-dashed border-[#008E96]/30 rounded-2xl items-center justify-center bg-[#F0F9F9]"
          >
            <Ionicons name="camera-outline" size={32} color="#008E96" />
            <Text className="text-[12px] text-[#008E96] mt-2" style={{ fontFamily: 'Inter-SemiBold' }}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={pickImage}
            className="flex-1 h-32 border-2 border-dashed border-[#E5E7EB] rounded-2xl items-center justify-center bg-[#F9FAFB]"
          >
            <Ionicons name="images-outline" size={32} color="#99A1AF" />
            <Text className="text-[12px] text-[#6A7282] mt-2" style={{ fontFamily: 'Inter-SemiBold' }}>Upload Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View className="gap-4">
          <Text className="text-[16px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>Photo Tips</Text>
          <View className="flex-row flex-wrap gap-3">
            {photoTips.map((tip, index) => (
              <View 
                key={index} 
                className="w-[47%] bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] gap-1"
              >
                <Text className="text-[18px]">{tip.emoji}</Text>
                <Text className="text-[11px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>{tip.title}</Text>
                <Text className="text-[10px] text-[#6A7282] leading-[14px]" style={{ fontFamily: 'Inter-Regular' }}>{tip.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View className="gap-4 mb-6">
          <Text className="text-[16px] text-[#101828]" style={{ fontFamily: 'Inter-SemiBold' }}>What to capture?</Text>
          <View className="flex-row flex-wrap gap-2">
            {recommendations.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleRecommendation(item)}
                className={`px-4 py-2 rounded-full border ${selectedRecommendations.includes(item) ? 'bg-[#008E96] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
              >
                <Text className={`text-[12px] ${selectedRecommendations.includes(item) ? 'text-white' : 'text-[#6A7282]'}`} style={{ fontFamily: 'Inter-Medium' }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PhotosStep;
