'use client';

import React, { useEffect, forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LottieLoaderProps {
  message?: string;
  description?: string;
  className?: string;
  animationPath?: string;
}

const LottieLoader = forwardRef<HTMLDivElement, LottieLoaderProps>(
  (
    {
      message = 'Loading...',
      description = 'Please wait while the data is being loaded',
      className = 'w-60',
      animationPath = '/animation/loading.json',
    },
    
    ref
  ) => {
    const [lottieLoaded, setLottieLoaded] = useState(false);

    useEffect(() => {
      import('@lottiefiles/lottie-player').then(() => setLottieLoaded(true));
    }, []);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-3 py-8"
      >
        {lottieLoaded && (
          <lottie-player
            id="loading-animation"
            autoplay
            loop
            mode="normal"
            src={animationPath}
            className={className}
          />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-1"
        >
          <h3 className="font-semibold text-lg text-foreground">{message}</h3>
          <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">{description}</p>
        </motion.div>
      </motion.div>
    );
  }
);

LottieLoader.displayName = 'LottieLoader';

export default LottieLoader;
