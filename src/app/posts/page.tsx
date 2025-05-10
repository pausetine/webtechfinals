'use client';

import { Button, Card, TextInput, Avatar } from 'flowbite-react';
import { useState } from 'react';

let commentIdCounter = 4;
let postIdCounter = 3;

export default function Home() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Welcome to the Y2K Blog',
      content: 'This is our first post with vintage vibes!',
      comments: [
        { id: 1, author: 'User123', text: 'Love the aesthetic!' },
        { id: 2, author: 'RetroFan', text: 'Bring back the 2000s!' },
      ],
    },
    {
      id: 2,
      title: 'Why Flowbite is Cool',
      content: 'Flowbite makes UI development quick and stylish.',
      comments: [
        { id: 3, author: 'DevGuy', text: 'Agreed, Flowbite saves me time.' },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState({});
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handleAddComment = (postId: number) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                id: commentIdCounter++,
                author: 'Guest',
                text: commentText,
              },
            ],
          }
        : post
    );
    setPosts(updatedPosts);
    setNewComment({ ...newComment, [postId]: '' });
  };

  const handleAddPost = () => {
    const title = newPostTitle.trim();
    const content = newPostContent.trim();
    if (!title || !content) return;

    const newPost = {
      id: postIdCounter++,
      title,
      content,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* New Post Form */}
      <Card>
        <h2 className="text-xl font-bold mb-2">Create New Post</h2>
        <TextInput
          placeholder="Post title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="mb-2"
        />
        <TextInput
          placeholder="Post content"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="mb-4"
        />
        <Button color="pink" onClick={handleAddPost}>
          Add Post
        </Button>
      </Card>

      {/* Posts */}
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
                setNewComment({ ...newComment, [post.id]: e.target.value })
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
