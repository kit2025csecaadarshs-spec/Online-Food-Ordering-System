import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildFoodModelByType, ExplodedLayer } from './proceduralFood';
import { ThreeBottomDock } from './ThreeBottomDock';

interface FoodViewer3DProps {
  modelType: 'burger' | 'pizza' | 'bowl' | 'boba' | 'taco';
  activeToppings?: string[]; // IDs or keys of toppings currently enabled
  autoRotateDefault?: boolean;
  className?: string;
  showControls?: boolean;
}

export const FoodViewer3D: React.FC<FoodViewer3DProps> = ({
  modelType,
  activeToppings = [],
  autoRotateDefault = true,
  className = 'w-full h-full min-h-[360px]',
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explodeProgress, setExplodeProgress] = useState<number>(0);
  const [lightingPreset, setLightingPreset] = useState<'daylight' | 'studio' | 'sunset'>('daylight');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(autoRotateDefault);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Mutable refs for Three.js render loop without React re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const layersRef = useRef<ExplodedLayer[]>([]);
  const toppingsMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const explodeTargetRef = useRef<number>(0);
  const autoRotateRef = useRef<boolean>(autoRotateDefault);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.HemisphereLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const initialCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.2, 4.2));
  const initialTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.9, 0));

  // Sync explodeTargetRef
  useEffect(() => {
    explodeTargetRef.current = explodeProgress;
  }, [explodeProgress]);

  // Sync autoRotateRef
  useEffect(() => {
    autoRotateRef.current = isAutoRotating;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  // Update lighting preset in real-time
  useEffect(() => {
    const key = keyLightRef.current;
    const fill = fillLightRef.current;
    const rim = rimLightRef.current;
    const renderer = rendererRef.current;

    if (!key || !fill || !rim) return;

    if (lightingPreset === 'daylight') {
      key.color.set('#FFFDF7');
      key.intensity = 2.4;
      key.position.set(4, 7, 5);
      fill.color.set('#E0F2FE');
      fill.groundColor.set('#F5F5F4');
      fill.intensity = 1.3;
      rim.color.set('#FDE68A');
      rim.intensity = 1.0;
      if (renderer) renderer.toneMappingExposure = 1.15;
    } else if (lightingPreset === 'studio') {
      key.color.set('#FFFFFF');
      key.intensity = 2.6;
      key.position.set(3, 8, 4);
      fill.color.set('#F1F5F9');
      fill.groundColor.set('#E2E8F0');
      fill.intensity = 1.4;
      rim.color.set('#FFFFFF');
      rim.intensity = 1.2;
      if (renderer) renderer.toneMappingExposure = 1.1;
    } else if (lightingPreset === 'sunset') {
      key.color.set('#F97316');
      key.intensity = 2.8;
      key.position.set(5, 5, 4);
      fill.color.set('#FDE047');
      fill.groundColor.set('#78350F');
      fill.intensity = 1.2;
      rim.color.set('#EF4444');
      rim.intensity = 1.4;
      if (renderer) renderer.toneMappingExposure = 1.2;
    }
  }, [lightingPreset]);

  // Update active toppings visibility in real-time
  useEffect(() => {
    toppingsMapRef.current.forEach((obj, key) => {
      obj.visible = activeToppings.includes(key);
    });
  }, [activeToppings]);

  // Reset camera view callback
  const handleResetView = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.copy(initialCamPosRef.current);
      controlsRef.current.target.copy(initialTargetRef.current);
      controlsRef.current.update();
    }
    setExplodeProgress(0);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Scene & Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAFAF9');
    sceneRef.current = scene;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.copy(initialCamPosRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go under table
    controls.minDistance = 2.0;
    controls.maxDistance = 8.0;
    controls.target.copy(initialTargetRef.current);
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // 5. Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight('#FFFDF7', 2.4);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 16;
      keyLight.shadow.camera.left = -3;
      keyLight.shadow.camera.right = 3;
      keyLight.shadow.camera.top = 3;
      keyLight.shadow.camera.bottom = -3;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.HemisphereLight('#E0F2FE', '#F5F5F4', 1.3);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.DirectionalLight('#FDE68A', 1.0);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Soft Radial Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const radGrad = sCtx.createRadialGradient(64, 64, 5, 64, 64, 60);
    radGrad.addColorStop(0, 'rgba(40, 30, 20, 0.45)');
    radGrad.addColorStop(0.5, 'rgba(40, 30, 20, 0.2)');
    radGrad.addColorStop(1, 'rgba(40, 30, 20, 0)');
    sCtx.fillStyle = radGrad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.005;
    scene.add(shadowPlane);

    // 6. Build the Procedural 3D Food Model
    const foodData = buildFoodModelByType(modelType);
    scene.add(foodData.rootGroup);
    layersRef.current = foodData.layers;
    toppingsMapRef.current = foodData.toppingsMap;

    // Initialize toppings based on prop
    foodData.toppingsMap.forEach((obj, key) => {
      obj.visible = activeToppings.includes(key);
    });

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 7. Animation Loop with Exponential Damping
    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);

      // Smooth exploded layer interpolation
      const targetExp = explodeTargetRef.current;
      layersRef.current.forEach((layer) => {
        const destY = layer.initialY + targetExp * layer.explodeMultiplier * 1.5;
        layer.object.position.y = THREE.MathUtils.damp(
          layer.object.position.y,
          destY,
          8,
          delta
        );
      });

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [modelType]);

  return (
    <div className={`relative overflow-hidden select-none rounded-2xl bg-[#FAFAF9] ${className}`}>
      {/* Dedicated isolated WebGL canvas mount container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating View Badge in Top-Left */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2">
        <div className="bg-white/90 border border-stone-200/90 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-700 shadow-xs backdrop-blur-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="capitalize">{modelType} Studio 3D</span>
        </div>
      </div>

      {/* Subtle Interaction Hint in Top-Right */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none hidden sm:block">
        <span className="text-[11px] font-medium text-stone-600 bg-white/80 border border-stone-200/80 rounded-md px-2 py-0.5 backdrop-blur-xs">
          Drag to Orbit · Scroll to Zoom
        </span>
      </div>

      {/* Unified Collapsible Bottom Dock */}
      {showControls && (
        <ThreeBottomDock
          explodeProgress={explodeProgress}
          onExplodeChange={setExplodeProgress}
          lightingPreset={lightingPreset}
          onLightingChange={setLightingPreset}
          isAutoRotating={isAutoRotating}
          onToggleAutoRotate={() => setIsAutoRotating((prev) => !prev)}
          onResetView={handleResetView}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
      )}
    </div>
  );
};
