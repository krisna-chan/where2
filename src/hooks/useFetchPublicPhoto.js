import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import config from "./../config";
import useAuth from "./useAuth";
import { useDispatch } from "react-redux";
import { setAccommodationImages } from "../features/slices/accommodationSlice";

// THIS FUNCTION IS USED TO FETCH USER PHOTO
export const useFetchPublicPhoto = (userId, postId) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const fetchPhoto = useCallback(async () => {
    if (!userId || !postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${config.photo.fetchPublicPhotoForPost(userId,postId)}`);

      if (response.data?.imageUrl) {
        // Add cache-busting parameter
        setImageUrl(`${imageUrl}?t=${Date.now()}`);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching photo:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, postId]);

  // Initial fetch
  useEffect(() => {
    fetchPhoto();
  }, [fetchPhoto]);

  return { imageUrl, isLoading, error, fetchPhoto };
};

// THIS FUNCTION IS USED TO UPLOAD PICTURE

// FRONTEND: Updated useUploadPublicPhoto Hook
export const useUploadPublicPhoto = () => {
  const { userId } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();
  let urlParts;
  let imageUrl = '';
  let accommodationImage = {};
  let cnt = 1;
  const uploadPublicPhoto = async (files, folder, formType, postId) => {
    // Input validation
    const requiredFields = {
      file: files,
      folder: folder,
      formType: formType,
      postId: postId,
      userId: userId
    };

    // Check all required fields
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
      setUploadError(error.message);
      return { success: false, error: error.message };
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Step 1: Get S3 pre-signed URL
      if (formType === 'Accommodation') {
        for (let file of files) {
          const { data: s3Data } = await axios.post(config.photo.getS3Url, {
            folder,
            contentType: file.type
          });
          if (!s3Data?.url) {
            throw new Error("Failed to get S3 upload URL");
          }
    
          // Step 2: Upload to S3 with progress tracking
          await axios.put(s3Data.url, file, {
            headers: {
              "Content-Type": file.type,
              "Access-Control-Allow-Origin": "*",
              Authorization: undefined
            },
            withCredentials: false,
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setUploadProgress(progress);
            }
          });
    
          // Step 3: Construct the final image URL
          urlParts = new URL(s3Data.url);
          imageUrl = `${ urlParts.protocol }//${ urlParts.host }${ urlParts.pathname }`;
          console.log("imageUR>", imageUrl)
          accommodationImage[`img${cnt}`] = imageUrl,
            cnt++;
          
        }
      }
       else {
        const { data: s3Data } = await axios.post(config.photo.getS3Url, {
          folder,
          contentType: files.type
        });
  
        if (!s3Data?.url) {
          throw new Error("Failed to get S3 upload URL");
        }
  
        // Step 2: Upload to S3 with progress tracking
        await axios.put(s3Data.url, files, {
          headers: {
            "Content-Type": files.type,
            "Access-Control-Allow-Origin": "*",
            Authorization: undefined
          },
          withCredentials: false,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(progress);
          }
        });
  
        // Step 3: Construct the final image URL
         urlParts = new URL(s3Data.url);
         imageUrl = `${ urlParts.protocol }//${ urlParts.host }${ urlParts.pathname }`;
        console.log("imageUR>",imageUrl)
      }

      
      console.log("acoomimage", accommodationImage)
      if (accommodationImage.img1) {
        imageUrl = JSON.stringify(accommodationImage);
        dispatch(setAccommodationImages(accommodationImage))
      }
      console.log("final image url len", imageUrl)
      // Step 4: Update backend with the new image URL
      const response = await axios.post(config.photo.uploadPublicPhoto, {
        formType,
        userId,
        imageUrl:`${imageUrl}`,
        postId
        });

      // Proper response validation
      if (!response.data) {
        throw new Error("No response data received from server");
      }

      const { status, data, message } = response.data;
console.log("data",data)
      if (status !== 'success') {
        throw new Error(message || "Upload failed");
      }

      // Return success response with all relevant data
      return {
        success: true,
        imageUrl: data.imageUrl,
        postId: data.postId,
        imageId: data.id,
      };

    } catch (error) {
      console.error("Photo upload error:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });

      const errorMessage = error.response?.data?.message || error.message || "Failed to upload photo";
      setUploadError(errorMessage);

      return {
        success: false,
        error: errorMessage,
        details: error.response?.data
      };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadPublicPhoto,
    isUploading,
    uploadError,
    uploadProgress,
    clearError: () => setUploadError(null)
  };
};