// src/config/avatars.ts

import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export interface Avatar {
    id: string;
    svg?: string;
    gradientFrom: string;
    gradientTo: string;
}

export const AVAILABLE_AVATARS: Avatar[] = [
    {
        id: "brain-rocket",
        gradientFrom: "from-blue-400",
        gradientTo: "to-purple-500"
    },
    {
        id: "brain-fire",
        gradientFrom: "from-red-400",
        gradientTo: "to-orange-500"
    },
    {
        id: "brain-star",
        gradientFrom: "from-yellow-400",
        gradientTo: "to-amber-500"
    },
    {
        id: "brain-lightning",
        gradientFrom: "from-green-400",
        gradientTo: "to-teal-500"
    },
    {
        id: "brain-rainbow",
        gradientFrom: "from-pink-400",
        gradientTo: "to-indigo-500"
    },
    {
        id: "brain-robot",
        gradientFrom: "from-gray-400",
        gradientTo: "to-gray-600"
    },
    {
        id: "brain-book",
        gradientFrom: "from-brown-400",
        gradientTo: "to-yellow-600"
    },
    {
        id: "brain-plant",
        gradientFrom: "from-green-500",
        gradientTo: "to-emerald-600"
    },
    {
        id: "brain-globe",
        gradientFrom: "from-cyan-400",
        gradientTo: "to-blue-500"
    },
    {
        id: "brain-magic",
        gradientFrom: "from-purple-400",
        gradientTo: "to-pink-500"
    }
];

export const getAvatarById = (id: string): Avatar | undefined => {
    return AVAILABLE_AVATARS.find(avatar => avatar.id === id);
};

export const AVATAR_IDS = AVAILABLE_AVATARS.map(avatar => avatar.id);

// Updated DiceBear avatar generation method
export const generateDiceBearAvatar = (seed: string) => {
    return createAvatar(avataaars, {
        seed: seed, // Use the provided seed directly
        backgroundColor: ['blue', 'purple', 'red', 'green', 'yellow'],
        backgroundType: ['gradientLinear'],
        scale: 90
    }).toString();
};