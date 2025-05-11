'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
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
  email: string;
};

const fetchPost = async (id: string): Promise<Post> =>
  await (await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)).json();

const fetchComments = async (id: string): Promise<Comment[]> =>
  await (await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`)).json();

const fetchUsers = async (): Promise<User[]> =>
  await (await fetch(`https://jsonplaceholder.typicode.com/users`)).json();

export default function PostPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: post, isLoading: loadingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => fetchComments(id),
    enabled: !!id,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const getUserName = (userId: number) => {
    const user = users?.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getUserIdByEmail = (email: string): number | null => {
    const user = users?.find((user) => user.email.toLowerCase() === email.toLowerCase());
    return user ? user.id : null;
  };

  if (loadingPost) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner color="pink" size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link href="/" className="text-pink-600 hover:underline text-lg">
        ← Posts
      </Link>

      <div className="mt-6 p-6 bg-white/80 rounded-2xl shadow-lg border-2 border-pink-300">
        {post && users && (
          <p className="mt-4 text-lg font-semibold text-gray-800">
            {' '}
            <Link
              href={`/users/${post.userId}`}
              className="text-pink-800 hover:underline text-2xl font-bold"
            >
              {getUserName(post.userId)}
            </Link>
          </p>
        )}
        <h2 className="text-4xl font-bold text-pink-700 mb-2">{post?.title}</h2>
        <p className="text-xl text-gray-700">{post?.body}</p>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Comments</h3>
        {loadingComments ? (
          <Spinner color="pink" />
        ) : (
          <ul className="space-y-4">
            {comments?.map((comment) => {
              const commenterId = getUserIdByEmail(comment.email); // Get user ID for commenter
              return (
                <li
                  key={comment.id}
                  className="bg-pink-50 border border-pink-200 p-4 rounded-xl shadow-sm"
                >
                    <p className="text-pink-800 hover:underline text-l font-bold-s">{comment.email}</p>
                  <p className="font-semibold text-gray-800">
                    <span className="text-lg font-bold text-pink-700">{comment.name}</span>
                    {commenterId && (
                      <span className="ml-2 text-sm text-gray-500">
                        <Link
                          href={`/users/${commenterId}`}
                          className="text-pink-800 hover:underline"
                        >
                          (View Profile)
                        </Link>
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">{comment.body}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
