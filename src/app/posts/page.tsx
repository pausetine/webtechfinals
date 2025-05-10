'use client';

import { useEffect, useState } from 'react';
import { Spinner } from 'flowbite-react';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});
  const [loadingPostId, setLoadingPostId] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then(setPosts)
      .catch((err) => console.error('Failed to load posts', err));
  }, []);

  const handlePostClick = async (postId: number) => {
    // Toggle comments
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }

    setExpandedPostId(postId);

    // Fetch comments if not already loaded
    if (!commentsMap[postId]) {
      setLoadingPostId(postId);
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const data = await res.json();
        setCommentsMap((prev) => ({ ...prev, [postId]: data }));
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setLoadingPostId(null);
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.id} className="border rounded p-4 shadow-sm bg-white">
            <button
              onClick={() => handlePostClick(post.id)}
              className="text-left w-full"
            >
              <h2 className="text-xl font-semibold text-pink-700">{post.title}</h2>
              <p className="text-gray-700 mt-2">{post.body}</p>
            </button>

            {expandedPostId === post.id && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Comments</h3>
                {loadingPostId === post.id ? (
                  <Spinner color="pink" aria-label="Loading comments..." />
                ) : (
                  <ul className="space-y-3">
                    {commentsMap[post.id]?.map((comment) => (
                      <li
                        key={comment.id}
                        className="border p-3 rounded bg-gray-50"
                      >
                        <p className="font-semibold">{comment.name}</p>
                        <p className="text-sm text-gray-600">{comment.body}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
