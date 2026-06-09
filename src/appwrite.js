// Appwrite configuration and service layer
// Uses environment variables from .env file
// Falls back to localStorage if Appwrite is not configured

import { Client, Databases, Storage, Query, ID } from 'appwrite';
import { MOCK_POSTS } from './mockPosts';

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || '';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID || '';
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || '';

const isConfigured = ENDPOINT && PROJECT_ID && DATABASE_ID && COLLECTION_ID
  && PROJECT_ID !== 'your_project_id';

let client, databases, storage;

if (isConfigured) {
  client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  databases = new Databases(client);
  storage = new Storage(client);
}

export { MOCK_POSTS };
export const isMockMode = !isConfigured;
export const isImageUploadConfigured = Boolean(isConfigured && STORAGE_BUCKET_ID);

const LOCAL_STORAGE_KEY = 'portfolio_blog_posts';

/**
 * Gets posts from localStorage or initializes with mock posts.
 */
function getLocalPosts() {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!local) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_POSTS));
    return MOCK_POSTS;
  }
  try {
    return JSON.parse(local);
  } catch (e) {
    console.error('Failed to parse local storage posts:', e);
    return MOCK_POSTS;
  }
}

/**
 * Saves posts to localStorage.
 */
function setLocalPosts(posts) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
}

/**
 * Fetch all blog posts from Appwrite, or return local storage data.
 */
export async function getBlogPosts() {
  if (!isConfigured) {
    return { posts: getLocalPosts(), isMock: true };
  }
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('date'),
      Query.limit(50),
    ]);
    return { posts: response.documents, isMock: false };
  } catch (err) {
    console.error('Appwrite fetch error:', err);
    return { posts: getLocalPosts(), isMock: true };
  }
}

/**
 * Fetch a single blog post by ID from Appwrite, or from local storage.
 */
export async function getBlogPost(id) {
  if (!isConfigured) {
    const posts = getLocalPosts();
    const post = posts.find((p) => p.$id === id) || null;
    return { post, isMock: true };
  }
  try {
    const post = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    return { post, isMock: false };
  } catch (err) {
    console.error('Appwrite fetch error:', err);
    const posts = getLocalPosts();
    const post = posts.find((p) => p.$id === id) || null;
    return { post, isMock: true };
  }
}

/**
 * Create a new blog post.
 */
export async function createBlogPost(data) {
  if (!isConfigured) {
    const posts = getLocalPosts();
    const newPost = {
      ...data,
      $id: 'post-' + Date.now(),
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };
    const updated = [newPost, ...posts];
    setLocalPosts(updated);
    return { post: newPost, isMock: true };
  }

  const post = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data);
  return { post, isMock: false };
}

/**
 * Update an existing blog post by ID.
 */
export async function updateBlogPost(id, data) {
  if (!isConfigured) {
    const posts = getLocalPosts();
    let updatedPost = null;
    const updated = posts.map((p) => {
      if (p.$id === id) {
        updatedPost = { ...p, ...data, $updatedAt: new Date().toISOString() };
        return updatedPost;
      }
      return p;
    });
    if (!updatedPost) {
      throw new Error('Post not found');
    }
    setLocalPosts(updated);
    return { post: updatedPost, isMock: true };
  }

  const post = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, data);
  return { post, isMock: false };
}

/**
 * Delete a blog post by ID.
 */
export async function deleteBlogPost(id) {
  if (!isConfigured) {
    const posts = getLocalPosts();
    const updated = posts.filter((p) => p.$id !== id);
    setLocalPosts(updated);
    return { success: true, isMock: true };
  }

  await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
  return { success: true, isMock: false };
}

/**
 * Uploads a blog cover image to Appwrite Storage.
 * In local/mock mode, returns a data URL so uploads still work without a backend.
 */
export async function uploadBlogImage(file) {
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image must be smaller than 10 MB.');
  }

  if (!isConfigured) {
    return readFileAsDataUrl(file);
  }
  if (!STORAGE_BUCKET_ID) {
    throw new Error('Image upload is not configured. Add VITE_APPWRITE_STORAGE_BUCKET_ID.');
  }

  const uploaded = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
  return storage.getFileView(STORAGE_BUCKET_ID, uploaded.$id).toString();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });
}
