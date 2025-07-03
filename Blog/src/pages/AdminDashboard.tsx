import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';

const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, postsRes] = await Promise.all([
          axios.get('/admin/users'),
          axios.get('/admin/posts'),
        ]);
        setUsers(usersRes.data.users);
        setPosts(postsRes.data.posts);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-indigo-700 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg">
        <div className="text-red-700 font-semibold text-lg">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">All Users</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Username
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Email
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Role
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                          {u.username}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                          {u.email}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            u.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                          {u._id !== user?.id && (
                            <button 
                              onClick={() => handleDeleteUser(u._id)} 
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center font-medium"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">All Posts</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Title
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Author
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Created
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {posts.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                          {p.title}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                          {p.author?.username || 'Unknown'}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleDeletePost(p._id)} 
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center font-medium"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;