import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@userToken';

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('토큰 저장 실패', e);
  }
};

export const loadToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch(e) {
    console.error('토큰 삭제 실패', e);
  }
};
