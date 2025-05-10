"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "flowbite-react";


const fetchUserById = async (id: string) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

const fetchUserPosts = async (id: string) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

export default function UserProfilePage() {
  const { id } = useParams();

  // Fetch user data
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id as string),
    enabled: !!id,
  });

  // Fetch posts data
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchUserPosts(id as string),
    enabled: !!id,
  });

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  if (userLoading || postsLoading) return <p>Loading...</p>;
  if (userError || !user) return <p>Error loading user data.</p>;

  const lat = user.address?.geo?.lat;
  const lng = user.address?.geo?.lng;
  const mapEmbedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;

  return (
    <div className="p-6 space-y-6">
      {/* User Profile */}
      <div className="bg-pink-100 border-pink-300 shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-pink-700">{user.name}&apos;s Profile</h1>
        <p className="text-gray-700">📧 {user.email}</p>
        <p className="text-gray-700">📞 {user.phone}</p>
        <p className="text-gray-700">🌐 {user.website}</p>
      </div>

      {/* Posts Accordion */}
      <div>
        <h3 className="text-xl font-semibold">Posts:</h3>
        <div>
          <h2 id="accordion-open-heading-posts">
            <button
              type="button"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
            >
              <span className="flex items-center">Posts:</span>
              <svg
                className={`w-3 h-3 ${isAccordionOpen ? "rotate-180" : "rotate-0"} shrink-0`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          {isAccordionOpen && (
            <div className="p-5 border-t-0 border-gray-200 dark:border-gray-700">
              <ul className="space-y-2">
                {posts?.map((post: unknown) => (
                  <li key={post.id}>
                    <Link
                      href={`https://jsonplaceholder.typicode.com/posts/${post.id}`}
                      target="_blank"
                      className="text-pink-600 hover:font-bold hover:no-underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* User Location */}
      <h3 className="text-xl font-semibold mt-6">Location:</h3>
      <p>{user.address.street}, {user.address.city}</p>

      <div className="border-2 border-pink-500 rounded-lg overflow-hidden mt-4">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
