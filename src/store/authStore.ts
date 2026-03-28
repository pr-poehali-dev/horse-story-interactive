import { useState, useEffect } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  purchases: string[];
}

const USERS_KEY = "stories_users";
const SESSION_KEY = "stories_session";

export function getStoredUsers(): Record<string, User & { password: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getSession(): User | null {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function setSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function register(username: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getStoredUsers();
  if (Object.values(users).find(u => u.email === email)) {
    return { success: false, error: "Пользователь с таким email уже существует" };
  }
  const id = Date.now().toString();
  const user: User & { password: string } = {
    id,
    username,
    email,
    password,
    balance: 10,
    purchases: [],
  };
  users[id] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const { password: _, ...sessionUser } = user;
  setSession(sessionUser);
  return { success: true };
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const found = Object.values(users).find(u => u.email === email && u.password === password);
  if (!found) {
    return { success: false, error: "Неверный email или пароль" };
  }
  const { password: _, ...sessionUser } = found;
  setSession(sessionUser);
  return { success: true };
}

export function purchase(userId: string, productId: string, price: number): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const user = Object.values(users).find(u => u.id === userId);
  if (!user) return { success: false, error: "Пользователь не найден" };
  if (user.balance < price) return { success: false, error: "Недостаточно средств на балансе" };
  user.balance -= price;
  user.purchases.push(productId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const { password: _, ...sessionUser } = user;
  setSession(sessionUser);
  return { success: true };
}

export function refreshSession(): User | null {
  const session = getSession();
  if (!session) return null;
  const users = getStoredUsers();
  const user = users[session.id];
  if (!user) return null;
  const { password: _, ...sessionUser } = user;
  setSession(sessionUser);
  return sessionUser;
}

export function addComment(storyId: string, userId: string, username: string, text: string) {
  const key = `comments_${storyId}`;
  const comments = getComments(storyId);
  comments.push({
    id: Date.now().toString(),
    userId,
    username,
    text,
    date: new Date().toISOString(),
  });
  localStorage.setItem(key, JSON.stringify(comments));
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  date: string;
}

export function getComments(storyId: string): Comment[] {
  try {
    return JSON.parse(localStorage.getItem(`comments_${storyId}`) || "[]");
  } catch {
    return [];
  }
}
