import { cn } from '@/lib/utils';
import { File, Upload } from 'lucide-react';
import { useCallback } from 'react';
import { DropzoneInputProps, useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Label } from './label';

export interface UploadedElementProps {
  file: File;
}

export interface NotUploadedElementProps {
  secondaryMessage?: string;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
}

export interface FileInputProps {
  name?: string;
  file: File | null;
  className?: string;
  secondaryMessage?: string;
  label?: string;
  asterisk?: boolean;
  onFileChange?: (file: File) => void;
}

const UploadedElement = ({ file }: UploadedElementProps) => {
  return (
    <div className="flex flex-col gap-4 items-center px-12 py-6">
      <File color="white" size={36} />
      <p className="text-[#fef5ff] text-xs max-w-[100px] md:max-w-[200px] truncate">
        {file.name}
      </p>
    </div>
  );
};

const NotUploadedElement = ({ secondaryMessage }: NotUploadedElementProps) => {
  return (
    <div className="flex flex-col gap-1 sm:gap-4 items-center px-2 sm:px-12 py-6">
      <Upload color="black" size={20} />
      <p className="text-gray-500 text-center text-xs">
        Please upload your File Here, Max Size 4 MB
      </p>
      {secondaryMessage && (
        <p className="text-gray-500 text-xs text-center">{secondaryMessage}</p>
      )}
    </div>
  );
};

export const FileInput = ({
  file,
  // setFile,
  secondaryMessage,
  label,
  asterisk,
  onFileChange,
}: FileInputProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) {
      toast.error(
        'Invalid file type, only .jpg, .jpeg, .png, .zip, .pdf are allowed'
      );
      return;
    }

    if (onFileChange) {
      onFileChange(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/zip': ['.zip'],
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <div className={cn('flex flex-col gap-2', 'w-full')}>
      {label && (
        <Label>
          {label}
          {asterisk && <span className="text-red-500"> *</span>}
        </Label>
      )}

      <div
        {...getRootProps()}
        className={cn(
          'h-[200px] md:h-[128px] lg:h-[150px] p-3  cursor-pointer flex justify-center items-center rounded-xl border border-dashed',
          !file ? 'bg-white border-[#692597]' : 'bg-[#b6855e] border-white',
          isDragActive ? 'active' : ''
        )}
      >
        <input {...getInputProps()} />

        {file ? (
          <UploadedElement file={file} />
        ) : (
          <NotUploadedElement
            secondaryMessage={secondaryMessage}
            getInputProps={getInputProps}
          />
        )}
      </div>
    </div>
  );
};
