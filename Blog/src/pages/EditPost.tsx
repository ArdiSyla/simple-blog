import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {  useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchPostById, updatePost, clearError, clearCurrentPost } from '../store/slices/postsSlice';
import { Save, ArrowLeft } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

interface PostFormData {
  title: string;
  content: string;
}

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentPost, loading, error } = useAppSelector(state => state.posts);
  const [imageUrl, setImageUrl] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue
  } = useForm<PostFormData>();

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentPost) {
      setValue('title', currentPost.title);
      setValue('content', currentPost.content);
      setImageUrl(currentPost.image || '');
    }
  }, [currentPost, setValue]);

  const onSubmit = async (data: PostFormData) => {
    if (!id) return;
    
    try {
      const resultAction = await dispatch(updatePost({
        id,
        postData: {
          ...data,
          image: imageUrl
        }
      }));
      
      if (updatePost.fulfilled.match(resultAction)) {
        setUpdateSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  if (loading && !currentPost) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Post</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={() => dispatch(clearError())}
            className="text-sm underline float-right"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Post updated successfully! Redirecting to dashboard...</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register('title', { 
                required: 'Title is required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters'
                }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <ImageUpload 
            onImageUploaded={setImageUrl} 
            currentImage={imageUrl}
          />
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <textarea
              id="content"
              rows={8}
              {...register('content', { 
                required: 'Content is required',
                minLength: {
                  value: 10,
                  message: 'Content must be at least 10 characters'
                }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || updateSuccess}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;