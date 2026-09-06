'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function BasketballCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion and screen width for mobile optimization
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Cached container bounding box to avoid forced reflows on pointer events
    let cachedRect = container.getBoundingClientRect();
    const updateRect = () => {
      if (container) cachedRect = container.getBoundingClientRect();
    };

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, isMobile ? 4.7 : isTablet ? 4.4 : 4.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? 'default' : 'high-performance',
      });
      renderer.setSize(container.clientWidth, container.clientHeight);

      // Strict DPR Capping: 1.2 on mobile, 1.5 on tablet, 2.0 on desktop
      const maxDpr = isMobile ? 1.2 : isTablet ? 1.5 : 2.0;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    // Procedural Basketball Texture Generator (Fast lightweight resolution scaling)
    function createBasketballTextures() {
      // 256px on mobile (75% less pixel calculations), 512px on tablet, 1024px on desktop
      const size = isMobile ? 256 : isTablet ? 512 : 1024;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      // Leather Orange Base
      ctx.fillStyle = '#E85205';
      ctx.fillRect(0, 0, size, size);

      // Fine leather pebbling noise (Optimized step for mobile thread budget)
      const imgData = ctx.getImageData(0, 0, size, size);
      const data = imgData.data;
      const step = isMobile ? 8 : 4;
      for (let i = 0; i < data.length; i += step) {
        const noise = (Math.random() - 0.5) * 22;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.7));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.2));
      }
      ctx.putImageData(imgData, 0, 0);

      // Black Basketball Seam Ribs (Resolution-scaled line widths)
      const scaleFactor = size / 1024;
      ctx.strokeStyle = '#121214';
      ctx.lineWidth = Math.max(4, 14 * scaleFactor);
      ctx.lineCap = 'round';

      // Equator seam
      ctx.beginPath();
      ctx.moveTo(0, size / 2);
      ctx.lineTo(size, size / 2);
      ctx.stroke();

      // Meridian seams
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, size);
      ctx.stroke();

      // Curved side ribs
      ctx.lineWidth = Math.max(3, 12 * scaleFactor);
      ctx.beginPath();
      ctx.arc(size * 0.25, size / 2, size * 0.35, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(size * 0.75, size / 2, size * 0.35, Math.PI / 2, -Math.PI / 2);
      ctx.stroke();

      const colorTexture = new THREE.CanvasTexture(canvas);
      colorTexture.wrapS = THREE.RepeatWrapping;
      colorTexture.wrapT = THREE.ClampToEdgeWrapping;

      // Bump Texture
      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = size;
      bumpCanvas.height = size;
      const bCtx = bumpCanvas.getContext('2d')!;
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, size, size);

      // Add high frequency bump dots with lightweight pattern
      bCtx.fillStyle = '#A0A0A0';
      const bumpStep = isMobile ? 12 : 6;
      const dotSize = isMobile ? 3 : 2;
      for (let x = 0; x < size; x += bumpStep) {
        for (let y = 0; y < size; y += bumpStep) {
          if (Math.random() > 0.35) {
            bCtx.fillRect(x, y, dotSize, dotSize);
          }
        }
      }

      // Inset seams into bump
      bCtx.strokeStyle = '#202020';
      bCtx.lineWidth = Math.max(5, 16 * scaleFactor);
      bCtx.beginPath();
      bCtx.moveTo(0, size / 2);
      bCtx.lineTo(size, size / 2);
      bCtx.stroke();
      bCtx.beginPath();
      bCtx.moveTo(size / 2, 0);
      bCtx.lineTo(size / 2, size);
      bCtx.stroke();
      bCtx.beginPath();
      bCtx.arc(size * 0.25, size / 2, size * 0.35, -Math.PI / 2, Math.PI / 2);
      bCtx.stroke();
      bCtx.beginPath();
      bCtx.arc(size * 0.75, size / 2, size * 0.35, Math.PI / 2, -Math.PI / 2);
      bCtx.stroke();

      const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
      bumpTexture.wrapS = THREE.RepeatWrapping;
      bumpTexture.wrapT = THREE.ClampToEdgeWrapping;

      return { colorTexture, bumpTexture };
    }

    const { colorTexture, bumpTexture } = createBasketballTextures();

    // Basketball Mesh (Tiered segments: 24 mobile, 36 tablet, 64 desktop)
    const segments = isMobile ? 24 : isTablet ? 36 : 64;
    const ballGeometry = new THREE.SphereGeometry(1, segments, segments);
    const ballMaterial = new THREE.MeshStandardMaterial({
      map: colorTexture,
      bumpMap: bumpTexture,
      bumpScale: isMobile ? 0.025 : 0.035,
      roughness: 0.42,
      metalness: 0.04,
    });
    const basketball = new THREE.Mesh(ballGeometry, ballMaterial);
    basketball.position.set(0, 0.1, 0);
    scene.add(basketball);

    // Subtle 3D Court Ring Floor below ball
    const courtRingGeo = new THREE.RingGeometry(1.4, 1.44, isMobile ? 32 : 64);
    const courtRingMat = new THREE.MeshBasicMaterial({
      color: 0xff5e00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
    });
    const courtRing = new THREE.Mesh(courtRingGeo, courtRingMat);
    courtRing.rotation.x = Math.PI / 2;
    courtRing.position.y = -1.15;
    scene.add(courtRing);

    // Inner center circle
    const innerRingGeo = new THREE.RingGeometry(0.7, 0.73, isMobile ? 32 : 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = -1.15;
    scene.add(innerRing);

    // Floating subtle particles (Budgeted count for mobile frame rate)
    const particleCount = isMobile ? 12 : isTablet ? 24 : 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 5;
      particlePos[i + 1] = (Math.random() - 0.5) * 4;
      particlePos[i + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xff8833,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting (Directional on mobile to avoid heavy SpotLight shader fragment overhead)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainKeyLight.position.set(3, 4, 3);
    scene.add(mainKeyLight);

    let orangeRimLight: THREE.Light;
    if (isMobile) {
      orangeRimLight = new THREE.DirectionalLight(0xff5e00, 3.2);
      orangeRimLight.position.set(-3, -1, -2);
    } else {
      const spot = new THREE.SpotLight(0xff5e00, 5.0, 10, Math.PI / 4, 0.4);
      spot.position.set(-3, -1, -2);
      spot.target = basketball;
      orangeRimLight = spot;
    }
    scene.add(orangeRimLight);

    const fillBlueLight = new THREE.DirectionalLight(0x404060, 1.2);
    fillBlueLight.position.set(-3, 2, 2);
    scene.add(fillBlueLight);

    // Mouse Tracking & Interaction with Momentum Lerp
    let mouseX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    // Natural Physical Scroll Momentum (Section 19: Basketball reacts to scroll down/up smoothly)
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let scrollRotVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // When user scrolls DOWN, ball rotates forward (+X). When user scrolls UP, ball reverses (-X).
      scrollRotVelocity += deltaY * 0.0022;
      // Clamp to prevent unnatural hyper-spinning on rapid flick scrolls
      scrollRotVelocity = Math.max(-0.16, Math.min(0.16, scrollRotVelocity));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handlePointerMove = (e: PointerEvent) => {
      // Use cachedRect to eliminate getBoundingClientRect layout thrashing
      const rect = cachedRect;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;

      // On non-touch devices, tilt ball smoothly towards cursor
      if (!isTouch) {
        mouseX = x;
      }

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        dragVelocityX = deltaX * 0.007;
        dragVelocityY = deltaY * 0.007;
        basketball.rotation.y += dragVelocityX;
        basketball.rotation.x += dragVelocityY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragVelocityX = 0;
      dragVelocityY = 0;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    // Resize & Orientation Handler
    const handleResize = () => {
      if (!container) return;
      updateRect();
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Animation Loop with IntersectionObserver Optimization
    let animationFrameId: number;
    let isRunning = false;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isRunning) return;
      animationFrameId = requestAnimationFrame(animate);

      // Clamp delta to avoid animation jumping after browser tab switch or resume
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        if (!isDragging) {
          // 1. Smooth drag release inertia dampening
          if (Math.abs(dragVelocityX) > 0.0001 || Math.abs(dragVelocityY) > 0.0001) {
            basketball.rotation.y += dragVelocityX;
            basketball.rotation.x += dragVelocityY;
            dragVelocityX *= 0.94;
            dragVelocityY *= 0.94;
          } else {
            // Stately natural court spin
            basketball.rotation.y += delta * 0.42;
            basketball.rotation.x = Math.sin(time * 0.4) * 0.12;
            basketball.position.y = 0.08 + Math.sin(time * 1.5) * 0.035;
          }

          // 2. Physical scroll momentum with smooth damping (Section 19)
          if (Math.abs(scrollRotVelocity) > 0.0001) {
            basketball.rotation.x += scrollRotVelocity;
            scrollRotVelocity *= 0.92;
          }
        }

        // Smoothly lerp tilt towards mouse (desktop only)
        if (!isTouch) {
          targetRotY = mouseX * 0.35;
          basketball.rotation.z += (targetRotY - basketball.rotation.z) * 0.06;
        }

        // Subtle particle drift
        particles.rotation.y = time * 0.04;

        // Court ring breathing glow
        courtRingMat.opacity = 0.22 + Math.sin(time * 2) * 0.06;
      }

      renderer.render(scene, camera);
    };

    // IntersectionObserver to pause rendering when offscreen (saves GPU/CPU cycles)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isRunning) {
            isRunning = true;
            clock.getDelta(); // flush delta to avoid snap
            animate();
          }
        } else {
          if (isRunning) {
            isRunning = false;
            cancelAnimationFrame(animationFrameId);
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      ballGeometry.dispose();
      ballMaterial.dispose();
      colorTexture.dispose();
      bumpTexture.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src="/brand/logo-crest.png"
          alt="Nizam Nawabs 3D Crest"
          className="w-64 h-64 object-contain animate-pulse-glow drop-shadow-[0_0_40px_rgba(255,94,0,0.4)]"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[260px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[480px] cursor-grab active:cursor-grabbing select-none touch-pan-y"
      title="Click and drag to rotate basketball"
    />
  );
}
