"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";

interface ProfileAvatarProps {
  className?: string; // Adiciona a prop className
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ className }) => {
  const mediaLink = 'http://127.0.0.1:8000';
  const { primeiroNome, ultimoNome, profilePicture } = useUser();

  return (
    <Avatar className={`w-12 h-12 ${className}`}>
      {profilePicture ? (
        <AvatarImage 
          src={`${mediaLink}${profilePicture}`} 
          alt={`${primeiroNome} ${ultimoNome}`} 
          style={{ objectFit: 'cover', objectPosition: 'center' }} // Ajusta o estilo da imagem
        />
      ) : (
        <AvatarFallback>{primeiroNome?.charAt(0)}{ultimoNome?.charAt(0)}</AvatarFallback>
      )}
    </Avatar>
  );
};

export default ProfileAvatar;
