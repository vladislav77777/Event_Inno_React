// src/components/BubbleBackground.tsx

import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const BubbleBackground = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "#ffffff" },
        particles: {
          number: {
            value: 40,
            density: {
              enable: true,
              area: 800,
            },
          },
          shape: {
            type: "circle",
          },
          color: {
            value: "#87cefa", // light blue
          },
          opacity: {
            value: 0.4,
          },
          size: {
            value: 20,
            random: true,
          },
          move: {
            direction: "top",
            outModes: "out",
            speed: 1,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "bubble",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 250,
              duration: 2,
              size: 30,
              opacity: 0.8,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default BubbleBackground;
