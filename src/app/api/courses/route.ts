import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      const courses = await prisma.course.findMany({
        where: { isPublished: true },
        include: {
          instructor: {
            select: { fullName: true }
          }
        }
      });
      return NextResponse.json(courses);
    }

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: { fullName: true, avatarUrl: true }
        },
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ message: 'Kursus tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
