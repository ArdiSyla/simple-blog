import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Author {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: Author;
  createdAt: string;
}

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/posts');
      return res.data.posts;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/posts/${id}`);
      return res.data.post;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch post');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: { title: string; content: string; image: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/posts', postData);
      return res.data.post;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (
    { id, postData }: { id: string; postData: { title: string; content: string; image: string } },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`/posts/${id}`, postData);
      return res.data.post;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/posts/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const uploadImage = createAsyncThunk(
  'posts/uploadImage',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data && res.data.url) {
        return res.data.url;
      } else {
        return rejectWithValue('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Upload error details:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to upload image');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all posts
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.posts = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch post by ID
    builder.addCase(fetchPostById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPostById.fulfilled, (state, action: PayloadAction<Post>) => {
      state.loading = false;
      state.currentPost = action.payload;
    });
    builder.addCase(fetchPostById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create post
    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
      state.loading = false;
      state.posts.unshift(action.payload);
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update post
    builder.addCase(updatePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
      state.loading = false;
      state.currentPost = action.payload;
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete post
    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Upload image
    builder.addCase(uploadImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadImage.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(uploadImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearError, clearCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;