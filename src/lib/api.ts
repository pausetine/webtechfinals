// src/lib/api.ts

// Fetch Users from JSONPlaceholder
export const fetchUsers = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
  
    return response.json();
  };
  
  // Fetch Posts from JSONPlaceholder
  export const fetchPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
  
    return response.json();
  };
  
  // Fetch Comments for a specific Post
  export const fetchComments = async (postId: number) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
  
    return response.json();
  };
  