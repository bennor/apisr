import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export const revalidate = 5;

export const GET = () => {
  const uuid = randomUUID();
  return NextResponse.json({ uuid });
};
