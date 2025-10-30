import axiosInstance from '../services/AxiosInstance';

// Fetch all posts
export function getPosts() {
  return axiosInstance.get('posts.json');
}

// Create a new post
export function createPost(postData) {
  return axiosInstance.post('posts.json', postData);
}

// Update an existing post
export function updatePost(postId, post) {
  return axiosInstance.put(`posts/${postId}.json`, post);
}

// Delete a post
export function deletePost(postId) {
  return axiosInstance.delete(`posts/${postId}.json`);
}

// Format Firebase object to array with id
export function formatPosts(postsData) {
  if (!postsData || typeof postsData !== 'object') return [];
  return Object.keys(postsData).map((key) => ({
    ...postsData[key],
    id: key
  }));
}
