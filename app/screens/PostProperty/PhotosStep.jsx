import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ paddingHorizontal: wp('5.3%'), paddingTop: hp('3%'), gap: hp('2.5%') }}>
        {/* Selected Images Preview */}
        {images.length > 0 && (
          <View style={{ gap: hp('1.5%') }}>
            <View className="flex-row justify-between items-center">
              <Text className="text-[#101828]" style={{ fontWeight: '600', fontSize: wp('4.3%') }}>
                Selected Photos ({images.length})
              </Text>
              <TouchableOpacity onPress={() => setImages([])}>
                <Text className="text-red-500" style={{ fontWeight: '500', fontSize: wp('3.2%') }}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: wp('3.2%') }}>
              {images.map((img, index) => (
                <View key={index} className="relative">
                  <Image 
                    source={{ uri: img.uri }} 
                    className="border border-[#E5E7EB]" 
                    style={{ width: wp('25.6%'), height: wp('25.6%'), borderRadius: wp('3.2%') }}
                  />
                  <TouchableOpacity 
                    className="absolute bg-white rounded-full shadow-sm"
                    style={{ top: hp('-0.5%'), right: wp('-1.5%') }}
                    onPress={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <Ionicons name="close-circle" size={wp('5.3%')} color="#6A7282" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Upload Options */}
        <View className="flex-row" style={{ gap: wp('4.3%') }}>
          <TouchableOpacity 
            onPress={takePhoto}
            className="flex-1 border-2 border-dashed border-[#008E96]/30 items-center justify-center bg-[#F0F9F9]"
            style={{ height: hp('15.8%'), borderRadius: wp('4.3%') }}
          >
            <Ionicons name="camera-outline" size={wp('8.5%')} color="#008E96" />
            <Text className="text-[#008E96]" style={{ fontWeight: '600', fontSize: wp('3.2%'), marginTop: hp('1%') }}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={pickImage}
            className="flex-1 border-2 border-dashed border-[#E5E7EB] items-center justify-center bg-[#F9FAFB]"
            style={{ height: hp('15.8%'), borderRadius: wp('4.3%') }}
          >
            <Ionicons name="images-outline" size={wp('8.5%')} color="#99A1AF" />
            <Text className="text-[#6A7282]" style={{ fontWeight: '600', fontSize: wp('3.2%'), marginTop: hp('1%') }}>Upload Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View style={{ gap: hp('2%') }}>
          <Text className="text-[#101828]" style={{ fontWeight: '600', fontSize: wp('4.3%') }}>Photo Tips</Text>
          <View className="flex-row flex-wrap justify-between" style={{ gap: wp('3.2%') }}>
            {photoTips.map((tip, index) => (
              <View 
                key={index} 
                className="bg-[#F9FAFB] border border-[#E5E7EB]"
                style={{ width: wp('42%'), padding: wp('3.2%'), borderRadius: wp('3.2%'), gap: hp('0.5%') }}
              >
                <Text style={{ fontSize: wp('4.8%') }}>{tip.emoji}</Text>
                <Text className="text-[#101828]" style={{ fontWeight: '600', fontSize: wp('2.9%') }}>{tip.title}</Text>
                <Text className="text-[#6A7282]" style={{ fontWeight: '400', fontSize: wp('2.7%'), lineHeight: hp('1.8%') }}>{tip.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={{ gap: hp('2%'), marginBottom: hp('3%') }}>
          <Text className="text-[#101828]" style={{ fontWeight: '600', fontSize: wp('4.3%') }}>What to capture?</Text>
          <View className="flex-row flex-wrap" style={{ gap: wp('2.1%') }}>
            {recommendations.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleRecommendation(item)}
                className={`border ${selectedRecommendations.includes(item) ? 'bg-[#008E96] border-[#008E96]' : 'bg-white border-[#E5E7EB]'}`}
                style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1%'), borderRadius: wp('4.3%') }}
              >
                <Text className={`${selectedRecommendations.includes(item) ? 'text-white' : 'text-[#6A7282]'}`} style={{ fontWeight: '500', fontSize: wp('3.2%') }}>
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
