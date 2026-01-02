import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import {
  profileData as defaultProfile,
  experienceData as defaultExperience,
  researchData as defaultResearch,
  validatorData as defaultValidators,
  postsData as defaultPosts
} from './mock';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    return storage.get(STORAGE_KEYS.PROFILE) || defaultProfile;
  });

  const [experiences, setExperiences] = useState(() => {
    return storage.get(STORAGE_KEYS.EXPERIENCES) || defaultExperience;
  });

  const [research, setResearch] = useState(() => {
    return storage.get(STORAGE_KEYS.RESEARCH) || defaultResearch;
  });

  const [validators, setValidators] = useState(() => {
    return storage.get(STORAGE_KEYS.VALIDATORS) || defaultValidators;
  });

  const [posts, setPosts] = useState(() => {
    return storage.get(STORAGE_KEYS.POSTS) || defaultPosts;
  });

  // Auto-save to localStorage when data changes
  useEffect(() => {
    storage.set(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.EXPERIENCES, experiences);
  }, [experiences]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.RESEARCH, research);
  }, [research]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.VALIDATORS, validators);
  }, [validators]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.POSTS, posts);
  }, [posts]);

  // Profile functions
  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  // Experience functions
  const addExperience = (exp) => {
    const newExp = { ...exp, id: Date.now().toString() };
    setExperiences([newExp, ...experiences]);
  };

  const updateExperience = (id, updatedExp) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, ...updatedExp } : exp
    ));
  };

  const deleteExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  // Research functions
  const addResearch = (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setResearch([newItem, ...research]);
  };

  const updateResearch = (id, updatedItem) => {
    setResearch(research.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ));
  };

  const deleteResearch = (id) => {
    setResearch(research.filter(item => item.id !== id));
  };

  // Validator functions
  const addValidator = (validator) => {
    const newValidator = { ...validator, id: Date.now().toString() };
    setValidators([...validators, newValidator]);
  };

  const updateValidator = (id, updatedValidator) => {
    setValidators(validators.map(v => 
      v.id === id ? { ...v, ...updatedValidator } : v
    ));
  };

  const deleteValidator = (id) => {
    setValidators(validators.filter(v => v.id !== id));
  };

  // Post functions
  const addPost = (post) => {
    const newPost = { 
      ...post, 
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setPosts([newPost, ...posts]);
  };

  const updatePost = (id, updatedPost) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, ...updatedPost } : post
    ));
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const value = {
    // Data
    profile,
    experiences,
    research,
    validators,
    posts,
    // Profile
    updateProfile,
    // Experiences
    addExperience,
    updateExperience,
    deleteExperience,
    // Research
    addResearch,
    updateResearch,
    deleteResearch,
    // Validators
    addValidator,
    updateValidator,
    deleteValidator,
    // Posts
    addPost,
    updatePost,
    deletePost
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
