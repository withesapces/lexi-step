// src/app/api/user/avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { AVATAR_IDS } from '@/src/config/avatars';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const data = await req.json();
    const { avatarId } = data;

    if (!avatarId || !AVATAR_IDS.includes(avatarId)) {
      return NextResponse.json({ 
        error: 'Avatar invalide', 
        availableAvatars: AVATAR_IDS 
      }, { status: 400 });
    }

    // Générer l'avatar DiceBear
    const avatarSvg = createAvatar(avataaars, {
        seed: `${session.user.id}-${avatarId}`, // Consistent seed
        backgroundColor: ['blue', 'purple', 'red', 'green', 'yellow'],
        backgroundType: ['gradientLinear'],
        scale: 90
      }).toString();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        avatar: avatarId,
        avatarUrl: avatarSvg 
      }
    });
    
    return NextResponse.json({ 
      message: 'Avatar mis à jour avec succès', 
      avatarId,
      avatarUrl: avatarSvg
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avatar:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la mise à jour de l\'avatar' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { avatar: true, avatarUrl: true }
    });

    // Générer un avatar par défaut si aucun n'existe
    const defaultAvatarSvg = user?.avatarUrl || createAvatar(avataaars, {
        seed: `${session.user.id}-avatar`, // Consistent seed
        backgroundColor: ['blue', 'purple', 'red', 'green', 'yellow'],
        backgroundType: ['gradientLinear'],
        scale: 90
      }).toString();

    return NextResponse.json({ 
      currentAvatar: user?.avatar || 'brain-rocket',
      currentAvatarUrl: defaultAvatarSvg,
      availableAvatars: AVATAR_IDS
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'avatar:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération de l\'avatar' 
    }, { status: 500 });
  }
}