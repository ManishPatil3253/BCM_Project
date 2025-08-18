import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Ensure this path is correct
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

// --- SKELETON LOADER COMPONENT ---
// Updated to show text placeholders before the image box.
const PostSkeleton = () => (
  <div className="container mx-auto px-6 py-12 max-w-4xl animate-pulse">
    <div className="w-full bg-white p-8 rounded-lg">
      <div className="h-10 bg-gray-300 rounded-md w-3/4 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-300 rounded-md w-1/2 mx-auto mb-10"></div>
      <div className="space-y-5 mb-10">
        <div className="h-6 bg-gray-300 rounded-md w-full"></div>
        <div className="h-6 bg-gray-300 rounded-md w-full"></div>
        <div className="h-6 bg-gray-300 rounded-md w-5/6"></div>
      </div>
      <div className="w-full h-96 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
function ViewPostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError("Invalid post ID.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("This post does not exist or has been removed.");
        }
      } catch (err) {
        setError("Failed to load the post.");
        console.error("Firebase fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50"><PostSkeleton /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen text-center flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-red-600 text-2xl mb-4 font-semibold">{error}</h2>
        <Link to="/" className="px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const formattedDate = post.createdAt?.toDate()
    ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(post.createdAt.toDate())
    : 'Date not available';

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20">
      {post && (
        <motion.article
          className="container mx-auto px-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Post Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-sans">{post.title}</h1>
            <p className="text-gray-500 text-base">
              Published by {post.authorName || 'Anonymous'} on {formattedDate}
            </p>
          </header>

          {/* Post Content (Description) */}
          <div
            className="prose prose-slate prose-lg max-w-none prose-p:leading-relaxed prose-a:text-indigo-600 font-serif"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Image Below the Description */}
          <div className="w-full h-auto max-h-[550px] bg-gray-200 rounded-xl overflow-hidden shadow-2xl my-12">
            <img
              src={`https://source.unsplash.com/1600x900/?${post.category.replace('-', ',')}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Category at the Bottom */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mt-8">
              Category: <span className="font-medium capitalize">{post.category.replace('-', ' ')}</span>
            </p>
          </div>
        </motion.article>
      )}
    </div>
  );
}

export default ViewPostPage;