import { Suspense } from 'react';

export default function AuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div />}>{children}</Suspense>;
}
