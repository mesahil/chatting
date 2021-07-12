// import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore } from 'redux'
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, userReducer)

export default () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
};

// export default configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });
