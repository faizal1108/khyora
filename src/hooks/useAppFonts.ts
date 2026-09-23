import {
  Livvic_400Regular,
  Livvic_600SemiBold,
  Livvic_700Bold,
  Livvic_900Black,
} from '@expo-google-fonts/livvic';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';

export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Livvic_400Regular,
    Livvic_600SemiBold,
    Livvic_700Bold,
    Livvic_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });
  return loaded;
}
