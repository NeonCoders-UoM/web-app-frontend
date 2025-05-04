'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import colors from '@/styles/colors';

const SplashPage = () => {
  const router = useRouter();
  const [animationStage, setAnimationStage] = useState(0);
  const letters = ['V', 'A', 'p', 'p'];

  useEffect(() => {
    // Stage 1: Individual letter animations
    const stage1 = setTimeout(() => {
      setAnimationStage(1);
    }, 300);

    // Stage 2: Letters assemble horizontally
    const stage2 = setTimeout(() => {
      setAnimationStage(2);
    }, 1500);

    // Stage 3: Fade out and navigate
    const stage3 = setTimeout(() => {
      setAnimationStage(3);
      // Wait for fade-out animation to complete before navigating
      setTimeout(() => {
        router.push('/login');
      }, 500);
    }, 2200);

    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div
        className={`transition-all duration-500 ease-in-out ${
          animationStage === 3 ? 'opacity-0 scale-110' : 'opacity-100'
        }`}
      >
        <div
          className={`flex ${
            animationStage >= 2 ? 'flex-row space-x-0' : 'flex-col space-y-3'
          } transition-all duration-700 ease-in-out`}
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{
                color: colors.primary[200], // #275FEB
                fontSize: animationStage >= 2 ? '3rem' : '3.5rem', // 48px and 56px
                fontWeight: 'bold',
                fontFamily: 'var(--font-family-display)',
                transition: 'all 500ms ease-in-out',
                opacity: animationStage >= 1 ? 1 : 0,
                transform: animationStage >= 1 ? 'translateY(0)' : 'translateY(-8rem)',
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SplashPage;