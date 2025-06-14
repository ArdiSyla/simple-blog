import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage by default
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import axios from 'axios';

// Configure axios globally
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

// Configure persist options
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'] // Only persist the user object
};

const postsPersistConfig = {
  key: 'posts',
  storage,
  whitelist: ['posts', 'currentPost'] // Persist posts and currentPost
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedPostsReducer = persistReducer(postsPersistConfig, postsReducer);

// Root reducer
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  posts: persistedPostsReducer
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;