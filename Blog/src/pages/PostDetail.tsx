import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchPostById, clearCurrentPost } from '../store/slices/postsSlice';
import { Calendar, User, ArrowLeft, Edit } from 'lucide-react';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { currentPost: post, loading, error } = useAppSelector(state => state.posts);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-medium">{error || 'Post not found'}</p>
        <Link to="/" className="text-red-700 font-medium underline mt-3 inline-block hover:text-red-800">
          Return to Home
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const isAuthor = user && post.author._id === user.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center group transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Posts
        </Link>
      </div>

      {post.image && (
        <div className="mb-6 rounded-xl overflow-hidden h-64 md:h-96 shadow-md">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>
        
        <div className="flex items-center text-gray-500 mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center mr-6">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium text-gray-700">{post.author.username}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {isAuthor && (
          <div className="mb-6">
            <Link 
              to={`/edit-post/${post._id}`}
              className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit this post
            </Link>
          </div>
        )}
        
        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph ? (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ) : <br key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;