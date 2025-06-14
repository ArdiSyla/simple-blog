import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    image: string;
    author: {
      _id: string;
      username: string;
    };
    createdAt: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Truncate content for preview
  const truncatedContent = post.content.length > 150 
    ? `${post.content.substring(0, 150)}...` 
    : post.content;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          <Link to={`/posts/${post._id}`} className="hover:text-indigo-600 transition-colors">
            {post.title}
          </Link>
        </h2>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <div className="flex items-center mr-4">
            <User className="w-4 h-4 mr-1" />
            <span>{post.author.username}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{truncatedContent}</p>
        
        <Link 
          to={`/posts/${post._id}`}
          className="inline-block text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;