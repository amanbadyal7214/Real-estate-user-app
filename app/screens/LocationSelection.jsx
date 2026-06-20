import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LocationSelection = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [recording, setRecording] = useState(null);
  const [isListening, setIsListening] = useState(false);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsListening(true);
      } else {
        Alert.alert("Permission denied", "Please grant microphone access.");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    setIsListening(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    // Note: To convert this to text, you would typically send 'uri' to an API
    // like Google Cloud Speech-to-Text or OpenAI Whisper.
    Alert.alert(
      "Recorded",
      "Voice captured! (Integration with transcription API needed for full text conversion)"
    );
  }

  const handleVoiceSearch = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleCitySelect = (cityName) => {
    router.push("/screens/Buy/BuySearch");
  };

  const popularCities = [
    { name: "Delhi", icon: "🏛️" },
    { name: "Mumbai", icon: "🏢" },
    { name: "Bengaluru", icon: "🏙️" },
    { name: "Noida", icon: "🏢" },
    { name: "Gurgaon", icon: "🏙️" },
    { name: "Hyderabad", icon: "🏛️" },
  ];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const citiesList = [
    ["Abohar", "Abu Dhabi"],
    ["Adilabad", "Agarmalwa"],
    ["Agartala", "Agra"],
    ["Ahmednagar", "Aizawl"],
    ["Ajman", "Ajmer"],
    ["Akola", "Alappuzha"],
    ["Alibag", "Aligarh"],
    ["Alipurduar", "Alirajpur"],
    ["Allahabad", "Almora"],
    ["Alwar", "Ambala"],
    ["Ambarnath", "Ambikapur"],
    ["Ambur", "Amer"],
    ["Amravati", "Amreli"],
    ["Amritsar", "Amroha"],
    ["Anand", "Anantapur"],
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingHorizontal: wp('2%') }}>
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-50" style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('2%'), marginTop: hp('5%') }}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={wp('6%')} color="#4A5565" />
        </TouchableOpacity>
        <Text className="font-inter-medium text-[#101828]" style={{ marginLeft: wp('4%'), fontSize: wp('5.5%') }}>
          Where do you want to Buy?
        </Text>
      </View>

      <ScrollView className="flex-1" style={{ paddingHorizontal: wp('4%') }} showsVerticalScrollIndicator={false}>
        <Text className="text-[#6A7282] font-inter-regular" style={{ fontSize: wp('3.5%'), marginBottom: hp('3%') }}>
          Choose a city which can be changed later
        </Text>

        {/* Search Input */}
        <View className="flex-row items-center bg-[#F9FAFB] border border-[#008E96]" style={{ borderRadius: wp('3%'), paddingHorizontal: wp('4%'), height: hp('6%'), marginBottom: hp('2%') }}>
          <TextInput
            placeholder="Type city here..."
            placeholderTextColor="rgba(16, 24, 40, 0.5)"
            className="flex-1 font-inter-regular"
            style={{ fontSize: wp('3.5%') }}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={handleVoiceSearch}>
            <Ionicons
              name={isListening ? "stop-circle-outline" : "mic-outline"}
              size={wp('5%')}
              color={isListening ? "#EF4444" : "#008E96"}
            />
          </TouchableOpacity>
        </View>

        {/* Current Location Button */}
        <TouchableOpacity className="flex-row items-center" style={{ marginBottom: hp('4%'), gap: wp('2%') }}>
          <Ionicons name="locate-outline" size={wp('5%')} color="#008E96" />
          <Text className="text-[#008E96] font-inter-medium" style={{ fontSize: wp('3.5%') }}>
            Use my current location
          </Text>
        </TouchableOpacity>

        {/* Popular Cities */}
        <Text className="text-[#6A7282] font-inter-medium" style={{ fontSize: wp('4%'), marginBottom: hp('2%') }}>
          Popular Cities
        </Text>
        <View className="flex-row flex-wrap justify-between" style={{ gap: hp('1.5%'), marginBottom: hp('4%') }}>
          {popularCities.map((city, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCitySelect(city.name)}
              className="flex-row items-center bg-[#F9FAFB] border border-[#E4E7EC]"
              style={{ width: '48%', borderRadius: wp('3%'), paddingHorizontal: wp('3%'), paddingVertical: hp('1.5%') }}
            >
              <Text style={{ fontSize: wp('5%'), marginRight: wp('2%') }}>{city.icon}</Text>
              <Text className="text-[#101828] font-inter-medium" style={{ fontSize: wp('3.5%') }}>
                {city.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Alphabet Search */}
        <Text className="text-[#6A7282] font-inter-regular" style={{ fontSize: wp('3.5%'), marginBottom: hp('2%') }}>
          Search in 330+ other cities
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-[#F9FAFB] border border-[#008E96]"
          style={{ borderRadius: wp('3%'), paddingVertical: hp('1%'), paddingHorizontal: wp('3%'), marginBottom: hp('3%') }}
        >
          {alphabet.map((letter) => (
            <TouchableOpacity key={letter} style={{ paddingHorizontal: wp('3%') }}>
              <Text
                className={
                  letter === "D"
                    ? "text-[#008E96] font-inter-bold"
                    : "text-[#6A7282] font-inter-medium"
                }
                style={{ fontSize: wp('3.5%') }}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cities List */}
        <View style={{ paddingBottom: hp('5%') }}>
          {citiesList.map((row, index) => (
            <View key={index} className="flex-row justify-between" style={{ marginBottom: hp('2%') }}>
              <TouchableOpacity
                style={{ width: '48%' }}
                onPress={() => handleCitySelect(row[0])}
              >
                <Text className="text-[#4A5565] font-inter-medium" style={{ fontSize: wp('3.8%') }}>
                  {row[0]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: '48%' }}
                onPress={() => handleCitySelect(row[1])}
              >
                <Text className="text-[#4A5565] font-inter-medium" style={{ fontSize: wp('3.8%') }}>
                  {row[1]}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationSelection;
