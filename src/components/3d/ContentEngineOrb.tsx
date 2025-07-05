import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { Tooltip } from '../ui/Tooltip';
import { useTheme } from '../../hooks/useTheme';
interface ContentEngineOrbProps {
  size?: number;
  onClick?: () => void;
  className?: string;
}
export const ContentEngineOrb: React.FC<ContentEngineOrbProps> = ({
  size = 300,
  onClick,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0
  });
  const {
    isDarkMode
  } = useTheme();
  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    // Scene setup
    const scene = new THREE.Scene();
    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, size / size, 0.1, 1000);
    camera.position.z = 5;
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    // Create the central orb
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    // Create a glass-like material for the orb
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isDarkMode ? '#2A3F4D' : '#EAF7F2'),
      transmission: 0.95,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      envMapIntensity: 1.5,
      ior: 1.5 // Glass-like refraction
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0x334455 : 0xffffff, 0.5);
    scene.add(ambientLight);
    // Add directional light for highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    // Add point light with the theme color for glow effect
    const pointLight = new THREE.PointLight(0x3fe0a5, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    // Create orbiting content icons
    const iconPositions = [{
      x: 0,
      y: 0,
      z: -2
    }, {
      x: 1.8,
      y: 0.8,
      z: 0
    }, {
      x: -1.8,
      y: 0.8,
      z: 0
    }, {
      x: 0,
      y: -2,
      z: 0
    }, {
      x: 1.5,
      y: -1.2,
      z: 1
    }, {
      x: -1.5,
      y: -1.2,
      z: 1
    } // Blog
    ];
    // Icon geometries and materials
    const iconGeometry = new THREE.SphereGeometry(0.15, 24, 24);
    const iconMaterials = [new THREE.MeshPhongMaterial({
      color: 0x3fe0a5
    }), new THREE.MeshPhongMaterial({
      color: 0xff6b6b
    }), new THREE.MeshPhongMaterial({
      color: 0x4ecdc4
    }), new THREE.MeshPhongMaterial({
      color: 0xffd166
    }), new THREE.MeshPhongMaterial({
      color: 0x6a0572
    }), new THREE.MeshPhongMaterial({
      color: 0x1a535c
    }) // Blog - dark teal
    ];
    // Create the icons
    const icons: THREE.Mesh[] = [];
    iconPositions.forEach((position, index) => {
      const icon = new THREE.Mesh(iconGeometry, iconMaterials[index]);
      icon.position.set(position.x, position.y, position.z);
      scene.add(icon);
      icons.push(icon);
    });
    // Add a subtle glow to the orb
    const glowGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x3fe0a5,
      transparent: true,
      opacity: 0.1
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);
    // Animation variables
    let rotationSpeed = 0.003;
    const normalSpeed = 0.003;
    const hoverSpeed = 0.008;
    let iconOrbitSpeed = 0.01;
    let frame: number;
    // Animation loop
    const animate = () => {
      frame = requestAnimationFrame(animate);
      // Rotate the sphere
      sphere.rotation.y += rotationSpeed;
      sphere.rotation.x += rotationSpeed * 0.3;
      // Animate the glow
      glow.scale.set(1 + Math.sin(Date.now() * 0.001) * 0.03, 1 + Math.sin(Date.now() * 0.001) * 0.03, 1 + Math.sin(Date.now() * 0.001) * 0.03);
      // Orbit the icons
      icons.forEach((icon, index) => {
        const angle = Date.now() * 0.001 * iconOrbitSpeed * (index % 2 === 0 ? 1 : -1);
        const radius = 1.8 + Math.sin(Date.now() * 0.002) * 0.1;
        icon.position.x = Math.cos(angle + index) * radius * (0.8 + index * 0.1);
        icon.position.z = Math.sin(angle + index) * radius * (0.8 + index * 0.1);
        icon.position.y = Math.sin(angle * 1.5) * 0.3 + iconPositions[index].y;
        // Pulse the icons
        const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.1;
        icon.scale.set(scale, scale, scale);
      });
      renderer.render(scene, camera);
    };
    animate();
    // Handle hover state
    const handleMouseEnter = () => {
      setIsHovering(true);
      rotationSpeed = hoverSpeed;
      setShowTooltip(true);
      // Enhance the glow
      glowMaterial.opacity = 0.2;
      pointLight.intensity = 3;
    };
    const handleMouseLeave = () => {
      setIsHovering(false);
      rotationSpeed = normalSpeed;
      setShowTooltip(false);
      // Restore the glow
      glowMaterial.opacity = 0.1;
      pointLight.intensity = 2;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Update tooltip position
      setTooltipPosition({
        x: e.clientX,
        y: e.clientY - 10
      });
      // Create a parallax effect
      const offsetX = (x / size - 0.5) * 0.5;
      const offsetY = (y / size - 0.5) * 0.5;
      camera.position.x = offsetX;
      camera.position.y = -offsetY;
      camera.lookAt(scene.position);
    };
    // Add event listeners
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(frame);
      scene.clear();
    };
  }, [size, isDarkMode]);
  return <div className={`relative ${className}`}>
      <div ref={containerRef} className={`w-[${size}px] h-[${size}px] cursor-pointer transition-transform duration-300 ${isHovering ? 'scale-105' : ''}`} onClick={onClick} style={{
      width: size,
      height: size
    }} />
      {showTooltip && <Tooltip text="This is your AI content engine" visible={showTooltip} x={tooltipPosition.x} y={tooltipPosition.y} />}
    </div>;
};