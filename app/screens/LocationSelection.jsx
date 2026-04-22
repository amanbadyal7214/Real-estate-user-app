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
    router.push("/screens/Buy");
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
    <SafeAreaView className="flex-1 px-2 bg-white">
      {/* Header */}
      <View className="px-4 py-4 mt-12 flex-row items-center border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#4A5565" />
        </TouchableOpacity>
        <Text className="ml-4 text-[22px] font-inter-medium text-[#101828]">
          Where do you want to Buy?
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-[#6A7282] text-sm font-inter-regular mb-6">
          Choose a city which can be changed later
        </Text>

        {/* Search Input */}
        <View className="flex-row items-center bg-[#F9FAFB] border border-[#008E96] rounded-xl px-4 h-12 mb-4">
          <TextInput
            placeholder="Type city here..."
            placeholderTextColor="rgba(16, 24, 40, 0.5)"
            className="flex-1 text-sm font-inter-regular"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={handleVoiceSearch}>
            <Ionicons
              name={isListening ? "stop-circle-outline" : "mic-outline"}
              size={20}
              color={isListening ? "#EF4444" : "#008E96"}
            />
          </TouchableOpacity>
        </View>

        {/* Current Location Button */}
        <TouchableOpacity className="flex-row items-center mb-8 gap-2">
          <Ionicons name="locate-outline" size={20} color="#008E96" />
          <Text className="text-[#008E96] text-sm font-inter-medium">
            Use my current location
          </Text>
        </TouchableOpacity>

        {/* Popular Cities */}
        <Text className="text-[#6A7282] text-base font-inter-medium mb-4">
          Popular Cities
        </Text>
        <View className="flex-row flex-wrap justify-between gap-y-3 mb-8">
          {popularCities.map((city, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCitySelect(city.name)}
              className="w-[48%] flex-row items-center bg-[#F9FAFB] border border-[#E4E7EC] rounded-xl px-3 py-3"
            >
              <Text className="text-xl mr-2">{city.icon}</Text>
              <Text className="text-[#101828] text-sm font-inter-medium">
                {city.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Alphabet Search */}
        <Text className="text-[#6A7282] text-sm font-inter-regular mb-4">
          Search in 330+ other cities
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-[#F9FAFB] border border-[#008E96] rounded-xl py-2 px-3 mb-6"
        >
          {alphabet.map((letter) => (
            <TouchableOpacity key={letter} className="px-3">
              <Text
                className={`text-sm ${
                  letter === "D"
                    ? "text-[#008E96] font-inter-bold"
                    : "text-[#6A7282] font-inter-medium"
                }`}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cities List */}
        <View className="pb-10">
          {citiesList.map((row, index) => (
            <View key={index} className="flex-row justify-between mb-4">
              <TouchableOpacity
                className="w-[48%]"
                onPress={() => handleCitySelect(row[0])}
              >
                <Text className="text-[#4A5565] text-[15px] font-inter-medium">
                  {row[0]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[48%]"
                onPress={() => handleCitySelect(row[1])}
              >
                <Text className="text-[#4A5565] text-[15px] font-inter-medium">
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
