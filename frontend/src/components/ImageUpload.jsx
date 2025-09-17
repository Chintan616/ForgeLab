import { useState, useRef } from 'react';
import { HiCloudUpload, HiX, HiEye } from 'react-icons/hi';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ images = [], onImagesChange, maxImages = 1 }) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState(images);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    // Only allow 1 file
    if (files.length > 1) {
      toast.error('You can only upload 1 image');
      return;
    }

    // Check if we already have an image
    if (previewImages.length >= maxImages) {
      toast.error('You can only upload 1 image. Remove the current image first.');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', files[0]); // Single file upload

      const response = await api.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newImages = [response.data.imagePath]; // Single image
      setPreviewImages(newImages);
      onImagesChange(newImages);
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={openFileDialog}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          uploading
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <HiCloudUpload className="h-8 w-8 text-white" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {uploading ? 'Uploading...' : 'Upload Gig Image'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Click to browse or drag and drop image here
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG, JPEG up to 20MB
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {previewImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Image
          </h4>
          
          <div className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={previewImages[0].startsWith('http') ? previewImages[0] : `http://localhost:5001${previewImages[0]}`}
                alt="Gig image"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.src = '/placeholder-image.png';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', previewImages[0]);
                }}
              />
            </div>
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  onClick={() => window.open(previewImages[0].startsWith('http') ? previewImages[0] : `http://localhost:5001${previewImages[0]}`, '_blank')}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                  title="View full size"
                >
                  <HiEye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeImage(0)}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                  title="Remove image"
                >
                  <HiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
