import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const shareId = searchParams.get('share');

    if (shareId) {
      const project = await prisma.project.findUnique({
        where: { shareId },
        include: { user: { select: { name: true, image: true } } },
      });

      if (!project) {
        return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 });
      }

      await prisma.share.updateMany({
        where: { projectId: project.id },
        data: { views: { increment: 1 } },
      });

      return NextResponse.json(project);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { title, description, type, data } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        type,
        data,
        userId: user.id,
      },
    });

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'خطأ في إنشاء المشروع' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id, title, description, data, isPublic } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود أو لا تملك صلاحياته' }, { status: 403 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        data,
        isPublic,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'خطأ في تحديث المشروع' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف المشروع مطلوب' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
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
