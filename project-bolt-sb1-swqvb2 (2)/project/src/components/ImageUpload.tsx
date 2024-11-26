import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';

const ImageUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileImage = useProfileStore((state) => state.updateProfileImage);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <p className="text-sm text-gray-500">
          Recommended: Square image, minimum 400x400 pixels
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;