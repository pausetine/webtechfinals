'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

type User = {
  id: number;
  name: string;
};

const fetchPosts = async (): Promise<Post[]> =>
  await (await fetch('https://jsonplaceholder.typicode.com/posts')).json();

const fetchUsers = async (): Promise<User[]> =>
  await (await fetch('https://jsonplaceholder.typicode.com/users')).json();

const fetchComments = async (postId: number): Promise<Comment[]> =>
  await (await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)).json();

export default function Home() {
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const {
    data: comments,
    isLoading: loadingComments,
  } = useQuery({
    queryKey: ['comments', expandedPostId],
    queryFn: () => fetchComments(expandedPostId!),
    enabled: !!expandedPostId,
  });

  const getUserName = (userId: number) => {
    const user = users?.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getUserProfileLink = (userId: number) => `/users/${userId}`;

  if (loadingPosts || loadingUsers) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner color="pink" size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-700">Posts</h1>

      <ul className="space-y-6">
        {posts?.map((post) => (
          <li
            key={post.id}
            className="border-4 border-pink-400 bg-white/70 rounded-2xl p-6 m-4 shadow-md hover:shadow-pink-300 transition-all"
          >
            <Link
              href={getUserProfileLink(post.userId)}
              className="text-3xl font-bold text-pink-800 hover:underline block"
            >
              {getUserName(post.userId)}
            </Link>

            <button onClick={() => setExpandedPostId(post.id)} className="text-left w-full mt-4">
              <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
              <p className="text-lg text-gray-700 mt-3">{post.body}</p>
            </button>

            {expandedPostId === post.id && (
              <div className="mt-6">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Comments</h3>
                {loadingComments ? (
                  <Spinner color="pink" aria-label="Loading comments..." />
                ) : (
                  <ul className="space-y-4">
                    {comments?.slice(0, 3).map((comment) => (
                      <li
                        key={comment.id}
                        className="bg-pink-50 border border-pink-200 rounded-xl shadow-sm p-4 space-y-1"
                      >
                        <p className="text-xl font-bold text-pink-700">{comment.email}</p>
                        <p className="text-lg font-semibold text-gray-800">{comment.name}</p>
                        <p className="text-sm text-gray-600">{comment.body}</p>
                      </li>
                    ))}
                  </ul>
                )}

                <Link href={`/posts/${post.id}`} passHref>
                  <button className="mt-4 w-full text-center bg-pink-500 text-white rounded-xl py-2 font-semibold hover:bg-pink-600 shadow-md transition-all">
                    View Full Post
                  </button>
                </Link>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
