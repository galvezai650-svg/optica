import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Payment API - handles upgrade requests to PRO ($17) and ULTRA ($29) plans

const PAYMENT_LINKS = {
  PRO: 'https://mpago.li/1pmRqCN',
  ULTRA: 'https://mpago.li/2WKm6JV',
};

const PLAN_PRICES = {
  PRO: 17.00,
  ULTRA: 29.00,
};

export async function POST(request: NextRequest) {
  try {
    const { userId, plan } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Validate plan
    if (plan !== 'PRO' && plan !== 'ULTRA') {
      return NextResponse.json({ error: 'Invalid plan. Must be PRO or ULTRA' }, { status: 400 });
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for existing pending payment
    const existingPayment = await db.payment.findFirst({
      where: {
        userId,
        status: 'PENDING',
      },
    });

    if (existingPayment) {
      return NextResponse.json({ 
        payment: existingPayment,
        message: 'Ya tienes una solicitud pendiente',
        paymentUrl: PAYMENT_LINKS[existingPayment.plan as keyof typeof PAYMENT_LINKS],
      });
    }

    // Create new payment request
    const payment = await db.payment.create({
      data: {
        userId,
        amount: PLAN_PRICES[plan as keyof typeof PLAN_PRICES],
        status: 'PENDING',
        plan,
      },
    });

    return NextResponse.json({ 
      payment,
      message: 'Solicitud de pago creada',
      paymentUrl: PAYMENT_LINKS[plan as keyof typeof PAYMENT_LINKS],
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const payments = await db.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const pendingPayment = payments.find(p => p.status === 'PENDING');

    // Check if user has been upgraded (approved payment)
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    return NextResponse.json({ 
      payments,
      pendingPayment,
      currentPlan: user?.plan || 'BASIC',
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
