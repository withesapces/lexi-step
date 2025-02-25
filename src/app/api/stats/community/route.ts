// app/api/stats/community/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Get today's start and end timestamps
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get total words written today
        const todayEntries = await prisma.writingEntry.findMany({
            where: {
                createdAt: {
                    gte: today,
                    lt: tomorrow
                }
            },
            select: {
                wordCount: true
            }
        });

        const wordsToday = todayEntries.reduce((sum, entry) => sum + entry.wordCount, 0);

        // Get users with 7+ day streaks
        const streakingUsers = await prisma.writingStreak.count({
            where: {
                currentStreak: {
                    gte: 7
                }
            }
        });

        // Get number of users who wrote in the last 60 minutes (considered "online")
        const fifteenMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
        const onlineUsers = await prisma.writingEntry.findMany({
            where: {
                createdAt: {
                    gte: fifteenMinutesAgo
                }
            },
            select: {
                userId: true
            },
            distinct: ['userId']
        });

        const onlineWriters = onlineUsers.length;

        return NextResponse.json({
            wordsToday,
            streakingMembers: streakingUsers,
            onlineWriters
        });
    } catch (error) {
        console.error('Error fetching community stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch community stats' },
            { status: 500 }
        );
    }
}