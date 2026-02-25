import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const createProjectSchema = z.object({
  title: z.string().trim().min(1, 'عنوان المشروع مطلوب').max(200, 'العنوان طويل جداً'),
  description: z.string().max(1000, 'الوصف طويل جداً').optional().nullable(),
  type: z.string().trim().min(1, 'نوع المشروع مطلوب').max(50, 'نوع المشروع غير صالح'),
  data: z.string().min(1, 'بيانات المشروع مطلوبة'),
});

const updateProjectSchema = z.object({
  id: z.string().trim().min(1, 'معرف المشروع مطلوب'),
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  data: z.string().min(1).optional(),
  isPublic: z.boolean().optional(),
});

async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  return user?.id ?? null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const shareId = searchParams.get('share');

    if (shareId) {
      const project = await prisma.project.findFirst({
        where: { shareId, isPublic: true },
        include: { user: { select: { name: true, image: true } } },
      });

      if (!project) {
        return NextResponse.json({ error: 'رابط المشاركة غير صالح أو غير متاح' }, { status: 404 });
      }

      await prisma.share.updateMany({
        where: { projectId: project.id },
        data: { views: { increment: 1 } },
      });

      return NextResponse.json(project);
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: 'خطأ في جلب المشاريع' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const parsed = createProjectSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        type: parsed.data.type,
        data: parsed.data.data,
        userId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في إنشاء المشروع' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const parsed = updateProjectSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: { id: parsed.data.id, userId },
    });

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود أو لا تملك صلاحياته' }, { status: 403 });
    }

    const updated = await prisma.project.update({
      where: { id: parsed.data.id },
      data: {
        ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
        ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
        ...(parsed.data.data !== undefined ? { data: parsed.data.data } : {}),
        ...(parsed.data.isPublic !== undefined ? { isPublic: parsed.data.isPublic } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'خطأ في تحديث المشروع' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف المشروع مطلوب' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود أو لا تملك صلاحياته' }, { status: 403 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: 'تم حذف المشروع بنجاح' });
  } catch {
    return NextResponse.json({ error: 'خطأ في حذف المشروع' }, { status: 500 });
  }
}
