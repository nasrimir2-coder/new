import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { profileAPI, experiencesAPI, researchAPI, validatorsAPI, postsAPI } from '../services/api';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [research, setResearch] = useState([]);
  const [validators, setValidators] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data on mount
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileData, expData, resData, valData, postData] = await Promise.all([
        profileAPI.get(),
        experiencesAPI.getAll(),
        researchAPI.getAll(),
        validatorsAPI.getAll(),
        postsAPI.getAll(),
      ]);
      
      setProfile(profileData);
      setExperiences(expData);
      setResearch(resData);
      setValidators(valData);
      setPosts(postData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Profile functions
  const updateProfile = async (newProfile) => {
    try {
      const updated = await profileAPI.update(newProfile);
      setProfile(updated);
      return updated;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  // Experience functions
  const addExperience = async (exp) => {
    try {
      const created = await experiencesAPI.create(exp);
      setExperiences([created, ...experiences]);
      return created;
    } catch (err) {
      console.error('Error creating experience:', err);
      throw err;
    }
  };

  const updateExperience = async (id, updatedExp) => {
    try {
      const updated = await experiencesAPI.update(id, updatedExp);
      setExperiences(experiences.map(exp => exp.id === id ? updated : exp));
      return updated;
    } catch (err) {
      console.error('Error updating experience:', err);
      throw err;
    }
  };

  const deleteExperience = async (id) => {
    try {
      await experiencesAPI.delete(id);
      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (err) {
      console.error('Error deleting experience:', err);
      throw err;
    }
  };

  // Research functions
  const addResearch = async (item) => {
    try {
      const created = await researchAPI.create(item);
      setResearch([created, ...research]);
      return created;
    } catch (err) {
      console.error('Error creating research:', err);
      throw err;
    }
  };

  const updateResearch = async (id, updatedItem) => {
    try {
      const updated = await researchAPI.update(id, updatedItem);
      setResearch(research.map(item => item.id === id ? updated : item));
      return updated;
    } catch (err) {
      console.error('Error updating research:', err);
      throw err;
    }
  };

  const deleteResearch = async (id) => {
    try {
      await researchAPI.delete(id);
      setResearch(research.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting research:', err);
      throw err;
    }
  };

  // Validator functions
  const addValidator = async (validator) => {
    try {
      const created = await validatorsAPI.create(validator);
      setValidators([...validators, created]);
      return created;
    } catch (err) {
      console.error('Error creating validator:', err);
      throw err;
    }
  };

  const updateValidator = async (id, updatedValidator) => {
    try {
      const updated = await validatorsAPI.update(id, updatedValidator);
      setValidators(validators.map(v => v.id === id ? updated : v));
      return updated;
    } catch (err) {
      console.error('Error updating validator:', err);
      throw err;
    }
  };

  const deleteValidator = async (id) => {
    try {
      await validatorsAPI.delete(id);
      setValidators(validators.filter(v => v.id !== id));
    } catch (err) {
      console.error('Error deleting validator:', err);
      throw err;
    }
  };

  // Post functions
  const addPost = async (post) => {
    try {
      const created = await postsAPI.create(post);
      setPosts([created, ...posts]);
      return created;
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const updatePost = async (id, updatedPost) => {
    try {
      const updated = await postsAPI.update(id, updatedPost);
      setPosts(posts.map(post => post.id === id ? updated : post));
      return updated;
    } catch (err) {
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const deletePost = async (id) => {
    try {
      await postsAPI.delete(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  // Refresh data
  const refreshData = () => {
    fetchAllData();
  };

  const value = {
    // Data
    profile,
    experiences,
    research,
    validators,
    posts,
    loading,
    error,
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
    deletePost,
    // Utilities
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
