'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

const fetchPosts = async () => await (await fetch('https://jsonplaceholder.typicode.com/posts')).json();

export default function HomePage() {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="relative p-8 bg-white/80 border-2 border-pink-300 rounded-2xl shadow-lg">
        {/* Optional lace border background image */}
        <div className="absolute inset-0 -z-10 opacity-10 rounded-2xl overflow-hidden">
          <Image
            src="/pinklaceborder.png"
            alt="Lace Border"
            fill
            className="object-cover"
          />
        </div>

        <h1 className="text-5xl font-bold text-pink-700 mb-4">Welcome to SNSerenity 🎀</h1>
        <p className="text-lg text-gray-700 mb-6">
          Dive into pretty posts, charming profiles, and sweet stats. Built with love & pink in mind 
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/users"
            className="bg-pink-500 text-white font-semibold px-6 py-2 rounded-xl hover:bg-pink-600 transition"
          >
            Browse Users
          </Link>
          <Link
            href="/dashboard"
            className="bg-pink-100 text-pink-800 font-semibold px-6 py-2 rounded-xl hover:bg-pink-200 transition"
          >
            View Dashboard 
          </Link>
        </div>
      </div>

      {/* Latest Posts Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-pink-700 mb-4">Latest Posts</h2>
        {isLoading ? (
          <p>Loading posts...</p>
        ) : isError ? (
          <p>There was an error loading posts. Please try again later.</p>
        ) : (
          <div className="space-y-6">
            {posts?.slice(0, 3).map((post: { id: number; title: string; body: string }) => (
              <div key={post.id} className="bg-pink-50 border border-pink-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-2xl font-bold text-black-100 mb-2">{post.title}</h3>
                <p className="text-lg text-gray-700 mb-4">{post.body}</p>
                <Link
                  href={`/posts/${post.id}`}
                  className="text-pink-500 hover:underline font-semibold"
                >
                  Read more
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
