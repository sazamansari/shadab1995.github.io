// Appwrite configuration and service layer
// Uses environment variables from .env file
// Falls back to mock data if Appwrite is not configured

import { Client, Databases, Query } from 'appwrite';

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || '';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID || '';

const isConfigured = ENDPOINT && PROJECT_ID && DATABASE_ID && COLLECTION_ID
  && PROJECT_ID !== 'your_project_id';

let client, databases;

if (isConfigured) {
  client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  databases = new Databases(client);
}

import { MOCK_POSTS } from './mockPosts';
export { MOCK_POSTS };

export const isMockMode = !isConfigured;

/**
 * Fetch all blog posts from Appwrite, or return mock data.
 */
export async function getBlogPosts() {
  if (!isConfigured) return { posts: MOCK_POSTS, isMock: true };
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('date'),
      Query.limit(50),
    ]);
    return { posts: response.documents, isMock: false };
  } catch (err) {
    console.error('Appwrite fetch error:', err);
    return { posts: MOCK_POSTS, isMock: true };
  }
}

/**
 * Fetch a single blog post by ID from Appwrite, or from mock data.
 */
export async function getBlogPost(id) {
  if (!isConfigured) {
    const post = MOCK_POSTS.find((p) => p.$id === id) || null;
    return { post, isMock: true };
  }
  try {
    const post = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    return { post, isMock: false };
  } catch (err) {
    console.error('Appwrite fetch error:', err);
    const post = MOCK_POSTS.find((p) => p.$id === id) || null;
    return { post, isMock: true };
  }
}
