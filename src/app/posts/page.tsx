'use client';

import { useState } from 'react';
import { Button, Card, TextInput, Avatar } from 'flowbite-react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api'; // <-- Make sure this exists
import { useParams } from 'next/navigation';

interface Comment {
  id: number;
  author: string;
  text: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
}

export default function Home() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery<Post[]>({
    queryKey: ['posts', id],
    queryFn: () => fetchUsers(id as string),
    enabled: !!id,
  });

  if (postsLoading) return <p>Loading...</p>;
  if (postsError || !posts) return <p>Error loading posts.</p>;

  const handleAddComment = (postId: number) => {
    const text = newComment[postId]?.trim();
    if (!text) return;

    // Fake update: in a real app, you'd make a mutation and refetch
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                author: 'Guest',
                text,
              },
            ],
          }
        : post
    );

    // This is a client-side only update for demo. No setPosts here since posts are from useQuery.
    setNewComment((prev) => ({ ...prev, [postId]: '' }));
    console.log('New comment added (not persisted):', updatedPosts);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Posts from API */}
      {posts.map((post) => (
        <Card key={post.id}>
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="mb-4">{post.content}</p>

          <div className="space-y-2">
            <h3 className="font-semibold">Comments:</h3>
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-center space-x-2 text-sm">
                <Avatar rounded size="xs" />
                <span className="font-medium">{comment.author}:</span>
                <span>{comment.text}</span>
              </div>
            ))}

            <TextInput
              placeholder="Add a comment..."
              sizing="sm"
              value={newComment[post.id] || ''}
              onChange={(e) =>
                setNewComment((prev) => ({
                  ...prev,
                  [post.id]: e.target.value,
                }))
              }
            />
            <Button color="pink" size="sm" onClick={() => handleAddComment(post.id)}>
              Post Comment
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

