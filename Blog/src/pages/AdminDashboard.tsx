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

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <section>
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Username</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td className="py-2 px-4 border">{u.username}</td>
                  <td className="py-2 px-4 border">{u.email}</td>
                  <td className="py-2 px-4 border">{u.role}</td>
                  <td className="py-2 px-4 border">
                    {u._id !== user?.id && (
                      <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:text-red-800 flex items-center">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">All Posts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Author</th>
                <th className="py-2 px-4 border">Created</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <td className="py-2 px-4 border">{p.title}</td>
                  <td className="py-2 px-4 border">{p.author?.username || 'Unknown'}</td>
                  <td className="py-2 px-4 border">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">
                    <button onClick={() => handleDeletePost(p._id)} className="text-red-600 hover:text-red-800 flex items-center">
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
