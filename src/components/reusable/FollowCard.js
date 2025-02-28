import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  Avatar,
  Skeleton,
} from '@mui/material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
const FollowCard = ({ 
    userId, 
    profile = '', 
    name = 'Unknown User', 
    userEmail = '', 
    userBio = '', 
    onCardClick, 
    followedAt = '',
    activeTab = 'followers', // Default to followers
  }) => { 
    const [imageError, setImageError] = React.useState(false); 
    const [imageLoading, setImageLoading] = React.useState(true); 
  
    const handleImageError = () => { 
      setImageError(true); 
      setImageLoading(false); 
    }; 
  
    const handleImageLoad = () => { 
      setImageLoading(false); 
    }; 
  
    const formattedDate = followedAt 
      ? new Date(followedAt).toLocaleDateString("en-CA") 
      : '';
  
    return (
      <Link to={`/public/user/${userId}`}>
        <Card className="w-full mb-2">
          <CardActionArea onClick={onCardClick}>
            <div className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-[50px] h-[50px] flex">
                  {imageLoading && (
                    <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
                  )}
                  
                  {imageError ? (
                    <Avatar className="w-10 h-10">
                      <span className="text-lg">{name.charAt(0)}</span>
                    </Avatar>
                  ) : (
                    <img
                      src={profile}
                      alt={`${name}'s profile`}
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
    
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h6 className="text-sm font-medium truncate">{name}</h6>
                      {userEmail && (
                        <p className="text-xs text-gray-500 truncate">
                          {userEmail}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      className="ml-4"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent link navigation
                        e.stopPropagation(); // Stop card click event
                        window.location.href = `/public/user/${userId}`;
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                  {userBio && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {userBio}
                    </p>
                  )}
                  {formattedDate && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {activeTab === 'followers' 
                        ? `Followed you on: ${formattedDate}`
                        : `You followed this user on: ${formattedDate}`
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardActionArea>
        </Card>
      </Link>
    );
  };
  
  export default FollowCard;