// ✅ Mock vector icons so Jest doesn't try to parse Ionicons.js (ESM)
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
