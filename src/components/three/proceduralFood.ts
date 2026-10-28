import * as THREE from 'three';

// Procedural Canvas Textures for PBR materials
function createBunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Baked golden brioche gradient
  const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
  grad.addColorStop(0, '#D97706');
  grad.addColorStop(0.6, '#B45309');
  grad.addColorStop(0.9, '#92400E');
  grad.addColorStop(1, '#78350F');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Fine toasted speckles
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 2 + 1;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(254, 243, 199, 0.4)' : 'rgba(120, 53, 15, 0.3)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPattyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark seared ground beef base
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(0, 0, 512, 512);

  // Cast-iron grill char marks
  ctx.fillStyle = 'rgba(26, 18, 16, 0.7)';
  for (let x = -100; x < 650; x += 60) {
    ctx.fillRect(x, 0, 18, 512);
  }

  // Crusty texture grains
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.6 ? '#5D4037' : '#271714';
    ctx.fillRect(x, y, Math.random() * 4 + 1, Math.random() * 4 + 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPizzaCrustTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Baked crust base
  ctx.fillStyle = '#E5C494';
  ctx.fillRect(0, 0, 512, 512);

  // Charred blister spots (wood-fired leopard spotting)
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = Math.random() * 10 + 3;
    const grad = ctx.createRadialGradient(x, y, 1, x, y, radius);
    grad.addColorStop(0, '#1E140F');
    grad.addColorStop(0.5, '#543D2B');
    grad.addColorStop(1, 'rgba(229, 196, 148, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCeramicPlateTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm off-white artisan stoneware
  ctx.fillStyle = '#F5F2EB';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle organic ceramic speckles
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.7 ? 'rgba(120, 113, 108, 0.25)' : 'rgba(168, 162, 158, 0.15)';
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export interface ExplodedLayer {
  object: THREE.Object3D;
  initialY: number;
  explodeMultiplier: number;
  key?: string; // topping key
}

export interface FoodModelResult {
  rootGroup: THREE.Group;
  layers: ExplodedLayer[];
  toppingsMap: Map<string, THREE.Object3D>;
}

/**
 * Procedural Artisanal Burger:
 * 1. Wooden serving board base (grounded)
 * 2. Bottom toasted brioche bun
 * 3. Balsamic caramelized onions
 * 4. Cast-iron Angus beef patty (grounded)
 * 5. Optional extra Angus beef patty
 * 6. Melted dripping Swiss Gruyère & sharp cheddar
 * 7. Optional extra cheese
 * 8. Optional crispy bacon rashers
 * 9. Ruffled butterhead lettuce (organic wavy shape)
 * 10. Heirloom red tomato slices (red translucent juicy)
 * 11. Optional sliced ripe avocado fans
 * 12. Optional fire jalapeño coins
 * 13. Top glazed brioche bun with procedural sesame seeds
 */
export function buildBurgerModel(): FoodModelResult {
  const root = new THREE.Group();
  root.name = 'burger_root';
  const layers: ExplodedLayer[] = [];
  const toppingsMap = new Map<string, THREE.Object3D>();

  const bunTexture = createBunTexture();
  const pattyTexture = createPattyTexture();
  const plateTexture = createCeramicPlateTexture();

  // 1. Serving Board / Plate
  const plateGeo = new THREE.CylinderGeometry(2.2, 2.0, 0.12, 48);
  const plateMat = new THREE.MeshStandardMaterial({
    map: plateTexture,
    roughness: 0.75,
    metalness: 0.05
  });
  const plateMesh = new THREE.Mesh(plateGeo, plateMat);
  plateMesh.position.y = 0.06;
  plateMesh.receiveShadow = true;
  root.add(plateMesh);

  // 2. Bottom Bun
  const bottomBunGroup = new THREE.Group();
  const bottomBunGeo = new THREE.CylinderGeometry(1.4, 1.25, 0.38, 36);
  const bottomBunMat = new THREE.MeshStandardMaterial({
    map: bunTexture,
    roughness: 0.65,
    metalness: 0.05
  });
  const bottomBunMesh = new THREE.Mesh(bottomBunGeo, bottomBunMat);
  bottomBunMesh.castShadow = true;
  bottomBunMesh.receiveShadow = true;
  bottomBunGroup.add(bottomBunMesh);
  bottomBunGroup.position.y = 0.35;
  root.add(bottomBunGroup);
  layers.push({ object: bottomBunGroup, initialY: 0.35, explodeMultiplier: 0.2 });

  // 3. Caramelized Onions
  const onionGroup = new THREE.Group();
  const onionGeo = new THREE.TorusGeometry(0.8, 0.09, 12, 28);
  const onionMat = new THREE.MeshStandardMaterial({
    color: '#5C1D24',
    roughness: 0.35,
    metalness: 0.15
  });
  for (let i = 0; i < 4; i++) {
    const oMesh = new THREE.Mesh(onionGeo, onionMat);
    oMesh.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
    oMesh.rotation.z = i * 1.2;
    oMesh.scale.set(0.9 + i * 0.1, 0.9 + i * 0.1, 1);
    oMesh.castShadow = true;
    onionGroup.add(oMesh);
  }
  onionGroup.position.y = 0.60;
  root.add(onionGroup);
  layers.push({ object: onionGroup, initialY: 0.60, explodeMultiplier: 0.4 });

  // 4. Primary Patty
  const pattyGroup = new THREE.Group();
  const pattyGeo = new THREE.CylinderGeometry(1.45, 1.45, 0.42, 36);
  const pattyMat = new THREE.MeshStandardMaterial({
    map: pattyTexture,
    roughness: 0.85,
    metalness: 0.1
  });
  const pattyMesh = new THREE.Mesh(pattyGeo, pattyMat);
  pattyMesh.castShadow = true;
  pattyMesh.receiveShadow = true;
  pattyGroup.add(pattyMesh);
  pattyGroup.position.y = 0.95;
  root.add(pattyGroup);
  layers.push({ object: pattyGroup, initialY: 0.95, explodeMultiplier: 0.7 });

  // 5. Extra Patty (Topping)
  const extraPattyGroup = new THREE.Group();
  const extraPattyMesh = new THREE.Mesh(pattyGeo, pattyMat);
  extraPattyMesh.castShadow = true;
  extraPattyMesh.receiveShadow = true;
  extraPattyGroup.add(extraPattyMesh);
  extraPattyGroup.position.y = 1.35;
  extraPattyGroup.visible = false;
  root.add(extraPattyGroup);
  toppingsMap.set('extraPatty', extraPattyGroup);
  layers.push({ object: extraPattyGroup, initialY: 1.35, explodeMultiplier: 0.9, key: 'extraPatty' });

  // 6. Melted Cheese (with dripping corners)
  const cheeseGroup = new THREE.Group();
  const cheeseGeo = new THREE.BoxGeometry(2.1, 0.08, 2.1);
  const cheeseMat = new THREE.MeshPhysicalMaterial({
    color: '#F59E0B',
    roughness: 0.35,
    metalness: 0.08,
    clearcoat: 0.3
  });
  const cheeseMesh = new THREE.Mesh(cheeseGeo, cheeseMat);
  cheeseMesh.rotation.y = Math.PI / 4;
  cheeseMesh.castShadow = true;
  cheeseGroup.add(cheeseMesh);

  // Melted drip drops at 4 corners
  const dripGeo = new THREE.ConeGeometry(0.14, 0.32, 16);
  for (let c = 0; c < 4; c++) {
    const angle = (c * Math.PI) / 2 + Math.PI / 4;
    const drip = new THREE.Mesh(dripGeo, cheeseMat);
    drip.position.set(Math.cos(angle) * 1.38, -0.14, Math.sin(angle) * 1.38);
    drip.rotation.x = Math.PI;
    drip.castShadow = true;
    cheeseGroup.add(drip);
  }
  cheeseGroup.position.y = 1.25;
  root.add(cheeseGroup);
  layers.push({ object: cheeseGroup, initialY: 1.25, explodeMultiplier: 1.1 });

  // Extra Cheese layer (Topping)
  const extraCheeseGroup = new THREE.Group();
  const extraCheeseMesh = new THREE.Mesh(cheeseGeo, cheeseMat);
  extraCheeseMesh.rotation.y = Math.PI / 8;
  extraCheeseMesh.castShadow = true;
  extraCheeseGroup.add(extraCheeseMesh);
  extraCheeseGroup.position.y = 1.32;
  root.add(extraCheeseGroup);
  toppingsMap.set('extraCheese', extraCheeseGroup);
  layers.push({ object: extraCheeseGroup, initialY: 1.32, explodeMultiplier: 1.2, key: 'extraCheese' });

  // 7. Crispy Bacon Rashers (Topping)
  const baconGroup = new THREE.Group();
  const baconMat = new THREE.MeshStandardMaterial({
    color: '#831843',
    roughness: 0.45,
    metalness: 0.1
  });
  for (let b = 0; b < 2; b++) {
    const bGeo = new THREE.BoxGeometry(2.2, 0.06, 0.45);
    const bMesh = new THREE.Mesh(bGeo, baconMat);
    bMesh.rotation.y = b * (Math.PI / 2.2);
    bMesh.castShadow = true;
    baconGroup.add(bMesh);
  }
  baconGroup.position.y = 1.42;
  baconGroup.visible = false;
  root.add(baconGroup);
  toppingsMap.set('bacon', baconGroup);
  layers.push({ object: baconGroup, initialY: 1.42, explodeMultiplier: 1.3, key: 'bacon' });

  // 8. Ruffled Butterhead Lettuce
  const lettuceGroup = new THREE.Group();
  const lettuceMat = new THREE.MeshStandardMaterial({
    color: '#4ADE80',
    roughness: 0.55,
    metalness: 0.02,
    side: THREE.DoubleSide
  });
  for (let l = 0; l < 6; l++) {
    const petalGeo = new THREE.CylinderGeometry(0.9, 0.4, 0.05, 16);
    const petal = new THREE.Mesh(petalGeo, lettuceMat);
    const angle = (l * Math.PI * 2) / 6;
    petal.position.set(Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8);
    petal.rotation.z = Math.cos(angle) * 0.2;
    petal.rotation.x = Math.sin(angle) * 0.2;
    petal.castShadow = true;
    lettuceGroup.add(petal);
  }
  lettuceGroup.position.y = 1.55;
  root.add(lettuceGroup);
  layers.push({ object: lettuceGroup, initialY: 1.55, explodeMultiplier: 1.5 });

  // 9. Heirloom Tomato Slices
  const tomatoGroup = new THREE.Group();
  const tomatoGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.14, 32);
  const tomatoMat = new THREE.MeshPhysicalMaterial({
    color: '#DC2626',
    roughness: 0.2,
    metalness: 0.05,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1
  });
  const t1 = new THREE.Mesh(tomatoGeo, tomatoMat);
  t1.position.set(-0.45, 0, 0.2);
  t1.castShadow = true;
  const t2 = new THREE.Mesh(tomatoGeo, tomatoMat);
  t2.position.set(0.45, 0, -0.2);
  t2.castShadow = true;
  tomatoGroup.add(t1, t2);
  tomatoGroup.position.y = 1.78;
  root.add(tomatoGroup);
  layers.push({ object: tomatoGroup, initialY: 1.78, explodeMultiplier: 1.8 });

  // 10. Fresh Sliced Avocado (Topping)
  const avocadoGroup = new THREE.Group();
  const avocadoMat = new THREE.MeshStandardMaterial({
    color: '#A3E635',
    roughness: 0.35,
    metalness: 0.05
  });
  for (let a = 0; a < 4; a++) {
    const aGeo = new THREE.CylinderGeometry(0.4, 0.35, 0.08, 16);
    const aMesh = new THREE.Mesh(aGeo, avocadoMat);
    aMesh.position.set(-0.6 + a * 0.4, 0, 0.3 - a * 0.2);
    aMesh.rotation.z = 0.2;
    aMesh.castShadow = true;
    avocadoGroup.add(aMesh);
  }
  avocadoGroup.position.y = 1.95;
  avocadoGroup.visible = false;
  root.add(avocadoGroup);
  toppingsMap.set('avocado', avocadoGroup);
  layers.push({ object: avocadoGroup, initialY: 1.95, explodeMultiplier: 2.1, key: 'avocado' });

  // 11. Pickled Jalapeño Coins (Topping)
  const jalapenoGroup = new THREE.Group();
  const jalapenoMat = new THREE.MeshStandardMaterial({
    color: '#15803D',
    roughness: 0.3,
    metalness: 0.05
  });
  for (let j = 0; j < 3; j++) {
    const jGeo = new THREE.TorusGeometry(0.2, 0.07, 10, 20);
    const jMesh = new THREE.Mesh(jGeo, jalapenoMat);
    jMesh.rotation.x = Math.PI / 2;
    jMesh.position.set((j - 1) * 0.5, 0, 0.1);
    jMesh.castShadow = true;
    jalapenoGroup.add(jMesh);
  }
  jalapenoGroup.position.y = 2.05;
  jalapenoGroup.visible = false;
  root.add(jalapenoGroup);
  toppingsMap.set('jalapenos', jalapenoGroup);
  layers.push({ object: jalapenoGroup, initialY: 2.05, explodeMultiplier: 2.3, key: 'jalapenos' });

  // 12. Top Brioche Bun (with Dome and Sesame Seeds)
  const topBunGroup = new THREE.Group();
  const topBunGeo = new THREE.SphereGeometry(1.48, 36, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const topBunMat = new THREE.MeshStandardMaterial({
    map: bunTexture,
    roughness: 0.45,
    metalness: 0.04
  });
  const topBunMesh = new THREE.Mesh(topBunGeo, topBunMat);
  topBunMesh.scale.set(1, 0.72, 1);
  topBunMesh.castShadow = true;
  topBunMesh.receiveShadow = true;
  topBunGroup.add(topBunMesh);

  // Procedural White Sesame Seeds
  const sesameGeo = new THREE.CapsuleGeometry(0.02, 0.05, 4, 8);
  const sesameMat = new THREE.MeshStandardMaterial({
    color: '#FEF3C7',
    roughness: 0.3,
    metalness: 0.05
  });
  for (let s = 0; s < 50; s++) {
    const phi = Math.random() * Math.PI * 0.35;
    const theta = Math.random() * Math.PI * 2;
    const r = 1.47;
    const sx = r * Math.sin(phi) * Math.cos(theta);
    const sy = r * Math.cos(phi) * 0.72;
    const sz = r * Math.sin(phi) * Math.sin(theta);
    const seed = new THREE.Mesh(sesameGeo, sesameMat);
    seed.position.set(sx, sy, sz);
    seed.lookAt(sx * 2, sy * 2, sz * 2);
    topBunGroup.add(seed);
  }

  topBunGroup.position.y = 2.08;
  root.add(topBunGroup);
  layers.push({ object: topBunGroup, initialY: 2.08, explodeMultiplier: 2.6 });

  return { rootGroup: root, layers, toppingsMap };
}

/**
 * Procedural Wood-Fired Pizza:
 * 1. Wooden Pizza Paddle
 * 2. 48-hr Fermented Dough Crust with Charred Blisters
 * 3. San Marzano Tomato Sauce Base
 * 4. Melted Fior di Latte Mozzarella Puddles
 * 5. Pepperoni Slices (Cupped with crisped edges)
 * 6. Fresh Whole Sweet Basil Leaves
 * 7. Extra Burrata / Hot Honey / Olives Toppings
 */
export function buildPizzaModel(): FoodModelResult {
  const root = new THREE.Group();
  root.name = 'pizza_root';
  const layers: ExplodedLayer[] = [];
  const toppingsMap = new Map<string, THREE.Object3D>();

  const crustTexture = createPizzaCrustTexture();
  const paddleTexture = createCeramicPlateTexture();

  // 1. Pizza Board / Paddle
  const paddleGeo = new THREE.CylinderGeometry(2.6, 2.5, 0.1, 48);
  const paddleMat = new THREE.MeshStandardMaterial({
    map: paddleTexture,
    roughness: 0.8,
    metalness: 0.02
  });
  const paddleMesh = new THREE.Mesh(paddleGeo, paddleMat);
  paddleMesh.position.y = 0.05;
  paddleMesh.receiveShadow = true;
  root.add(paddleMesh);

  // 2. Pizza Crust Ring (Puffy Beveled Rim)
  const crustGroup = new THREE.Group();
  const rimGeo = new THREE.TorusGeometry(1.85, 0.22, 16, 48);
  const crustMat = new THREE.MeshStandardMaterial({
    map: crustTexture,
    roughness: 0.75,
    metalness: 0.05
  });
  const rimMesh = new THREE.Mesh(rimGeo, crustMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = 0.24;
  rimMesh.castShadow = true;
  rimMesh.receiveShadow = true;
  crustGroup.add(rimMesh);

  // Center Dough Base
  const baseGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.08, 48);
  const baseMesh = new THREE.Mesh(baseGeo, crustMat);
  baseMesh.position.y = 0.16;
  baseMesh.receiveShadow = true;
  crustGroup.add(baseMesh);

  root.add(crustGroup);
  layers.push({ object: crustGroup, initialY: 0, explodeMultiplier: 0.2 });

  // 3. Tomato Sauce
  const sauceGroup = new THREE.Group();
  const sauceGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.05, 48);
  const sauceMat = new THREE.MeshPhysicalMaterial({
    color: '#991B1B',
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.4
  });
  const sauceMesh = new THREE.Mesh(sauceGeo, sauceMat);
  sauceMesh.position.y = 0.22;
  sauceMesh.receiveShadow = true;
  sauceGroup.add(sauceMesh);
  root.add(sauceGroup);
  layers.push({ object: sauceGroup, initialY: 0.22, explodeMultiplier: 0.5 });

  // 4. Melted Mozzarella Puddles
  const cheeseGroup = new THREE.Group();
  const cheeseMat = new THREE.MeshPhysicalMaterial({
    color: '#FEF08A',
    roughness: 0.3,
    metalness: 0.05,
    clearcoat: 0.5
  });
  for (let m = 0; m < 8; m++) {
    const angle = (m * Math.PI * 2) / 8 + Math.random() * 0.2;
    const dist = 0.5 + Math.random() * 0.8;
    const mozGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.05, 20);
    const mozMesh = new THREE.Mesh(mozGeo, cheeseMat);
    mozMesh.position.set(Math.cos(angle) * dist, 0.26, Math.sin(angle) * dist);
    mozMesh.castShadow = true;
    cheeseGroup.add(mozMesh);
  }
  root.add(cheeseGroup);
  layers.push({ object: cheeseGroup, initialY: 0.26, explodeMultiplier: 0.9 });

  // 5. Pepperoni Slices (Cupped with crisped edges)
  const pepperoniGroup = new THREE.Group();
  const pepGeo = new THREE.CylinderGeometry(0.3, 0.28, 0.05, 24);
  const pepMat = new THREE.MeshStandardMaterial({
    color: '#7F1D1D',
    roughness: 0.45,
    metalness: 0.1
  });
  for (let p = 0; p < 9; p++) {
    const angle = (p * Math.PI * 2) / 9 + 0.3;
    const dist = 0.4 + (p % 2) * 0.7;
    const pepMesh = new THREE.Mesh(pepGeo, pepMat);
    pepMesh.position.set(Math.cos(angle) * dist, 0.30, Math.sin(angle) * dist);
    pepMesh.rotation.x = 0.05;
    pepMesh.castShadow = true;
    pepperoniGroup.add(pepMesh);
  }
  root.add(pepperoniGroup);
  toppingsMap.set('pepperoni', pepperoniGroup);
  layers.push({ object: pepperoniGroup, initialY: 0.30, explodeMultiplier: 1.4, key: 'pepperoni' });

  // 6. Fresh Whole Basil Leaves
  const basilGroup = new THREE.Group();
  const basilMat = new THREE.MeshStandardMaterial({
    color: '#15803D',
    roughness: 0.4,
    metalness: 0.05,
    side: THREE.DoubleSide
  });
  for (let b = 0; b < 6; b++) {
    const bGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const bMesh = new THREE.Mesh(bGeo, basilMat);
    const angle = (b * Math.PI * 2) / 6 + 0.5;
    const dist = 0.6 + (b % 2) * 0.5;
    bMesh.scale.set(1, 0.12, 0.6);
    bMesh.position.set(Math.cos(angle) * dist, 0.34, Math.sin(angle) * dist);
    bMesh.rotation.y = angle;
    bMesh.castShadow = true;
    basilGroup.add(bMesh);
  }
  root.add(basilGroup);
  layers.push({ object: basilGroup, initialY: 0.34, explodeMultiplier: 1.9 });

  // 7. Creamy Burrata Center (Topping)
  const burrataGroup = new THREE.Group();
  const burrataGeo = new THREE.SphereGeometry(0.48, 24, 20);
  const burrataMat = new THREE.MeshPhysicalMaterial({
    color: '#FFFFFF',
    roughness: 0.25,
    metalness: 0.02,
    clearcoat: 0.6
  });
  const burrataMesh = new THREE.Mesh(burrataGeo, burrataMat);
  burrataMesh.scale.set(1, 0.65, 1);
  burrataMesh.position.y = 0.48;
  burrataMesh.castShadow = true;
  burrataGroup.add(burrataMesh);
  burrataGroup.visible = false;
  root.add(burrataGroup);
  toppingsMap.set('burrata', burrataGroup);
  layers.push({ object: burrataGroup, initialY: 0.48, explodeMultiplier: 2.3, key: 'burrata' });

  // 8. Castelvetrano Olives (Topping)
  const olivesGroup = new THREE.Group();
  const oliveGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const oliveMat = new THREE.MeshStandardMaterial({
    color: '#4D7C0F',
    roughness: 0.3,
    metalness: 0.08
  });
  for (let o = 0; o < 7; o++) {
    const oMesh = new THREE.Mesh(oliveGeo, oliveMat);
    const angle = (o * Math.PI * 2) / 7;
    oMesh.position.set(Math.cos(angle) * 1.1, 0.32, Math.sin(angle) * 1.1);
    oMesh.castShadow = true;
    olivesGroup.add(oMesh);
  }
  olivesGroup.visible = false;
  root.add(olivesGroup);
  toppingsMap.set('olives', olivesGroup);
  layers.push({ object: olivesGroup, initialY: 0.32, explodeMultiplier: 1.6, key: 'olives' });

  return { rootGroup: root, layers, toppingsMap };
}

/**
 * Procedural Rainbow Poke Bowl:
 * 1. Stoneware Ceramic Bowl
 * 2. Steamed Sushi Rice Bed
 * 3. Fresh Wild Salmon Cubes
 * 4. Fan-Sliced Avocado
 * 5. Sweet Edamame Beans
 * 6. Persian Cucumber Wheels
 * 7. Extra Salmon / Spicy Mayo / Crispy Shallots
 */
export function buildBowlModel(): FoodModelResult {
  const root = new THREE.Group();
  root.name = 'bowl_root';
  const layers: ExplodedLayer[] = [];
  const toppingsMap = new Map<string, THREE.Object3D>();

  const plateTexture = createCeramicPlateTexture();

  // 1. Stoneware Bowl
  const bowlGroup = new THREE.Group();
  const bowlGeo = new THREE.CylinderGeometry(1.8, 1.1, 0.9, 36, 1, true);
  const bowlMat = new THREE.MeshStandardMaterial({
    map: plateTexture,
    roughness: 0.6,
    metalness: 0.05,
    side: THREE.DoubleSide
  });
  const bowlMesh = new THREE.Mesh(bowlGeo, bowlMat);
  bowlMesh.position.y = 0.45;
  bowlMesh.castShadow = true;
  bowlMesh.receiveShadow = true;
  bowlGroup.add(bowlMesh);

  // Bowl Bottom Cap
  const bottomGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.1, 36);
  const bottomMesh = new THREE.Mesh(bottomGeo, bowlMat);
  bottomMesh.position.y = 0.05;
  bottomMesh.receiveShadow = true;
  bowlGroup.add(bottomMesh);

  root.add(bowlGroup);
  layers.push({ object: bowlGroup, initialY: 0, explodeMultiplier: 0.2 });

  // 2. Steamed Rice Bed
  const riceGroup = new THREE.Group();
  const riceGeo = new THREE.CylinderGeometry(1.65, 1.2, 0.4, 36);
  const riceMat = new THREE.MeshStandardMaterial({
    color: '#F8FAFC',
    roughness: 0.85,
    metalness: 0.02
  });
  const riceMesh = new THREE.Mesh(riceGeo, riceMat);
  riceMesh.position.y = 0.55;
  riceMesh.receiveShadow = true;
  riceGroup.add(riceMesh);
  root.add(riceGroup);
  layers.push({ object: riceGroup, initialY: 0.55, explodeMultiplier: 0.6 });

  // 3. Fresh Salmon Cubes
  const salmonGroup = new THREE.Group();
  const salmonMat = new THREE.MeshPhysicalMaterial({
    color: '#FB923C',
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.5
  });
  for (let s = 0; s < 10; s++) {
    const sGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
    const sMesh = new THREE.Mesh(sGeo, salmonMat);
    sMesh.position.set(-0.6 + (s % 3) * 0.35, 0.82, -0.6 + Math.floor(s / 3) * 0.35);
    sMesh.rotation.y = (s * 0.4);
    sMesh.castShadow = true;
    salmonGroup.add(sMesh);
  }
  root.add(salmonGroup);
  layers.push({ object: salmonGroup, initialY: 0.82, explodeMultiplier: 1.1 });

  // Extra Salmon (Topping)
  const extraSalmonGroup = new THREE.Group();
  for (let es = 0; es < 6; es++) {
    const esGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
    const esMesh = new THREE.Mesh(esGeo, salmonMat);
    esMesh.position.set(-0.5 + (es % 2) * 0.4, 1.05, -0.4 + Math.floor(es / 2) * 0.4);
    esMesh.castShadow = true;
    extraSalmonGroup.add(esMesh);
  }
  extraSalmonGroup.visible = false;
  root.add(extraSalmonGroup);
  toppingsMap.set('extraSalmon', extraSalmonGroup);
  layers.push({ object: extraSalmonGroup, initialY: 1.05, explodeMultiplier: 1.5, key: 'extraSalmon' });

  // 4. Avocado Fan
  const avocadoGroup = new THREE.Group();
  const avoMat = new THREE.MeshStandardMaterial({
    color: '#84CC16',
    roughness: 0.4,
    metalness: 0.05
  });
  for (let a = 0; a < 5; a++) {
    const aGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.08, 16);
    const aMesh = new THREE.Mesh(aGeo, avoMat);
    aMesh.position.set(0.6 + a * 0.12, 0.85, -0.3 + a * 0.18);
    aMesh.rotation.z = 0.4;
    aMesh.castShadow = true;
    avocadoGroup.add(aMesh);
  }
  root.add(avocadoGroup);
  layers.push({ object: avocadoGroup, initialY: 0.85, explodeMultiplier: 1.3 });

  // 5. Edamame Beans
  const edamameGroup = new THREE.Group();
  const edamameMat = new THREE.MeshStandardMaterial({
    color: '#22C55E',
    roughness: 0.45,
    metalness: 0.05
  });
  for (let e = 0; e < 12; e++) {
    const eGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const eMesh = new THREE.Mesh(eGeo, edamameMat);
    eMesh.scale.set(1.4, 0.9, 0.9);
    eMesh.position.set(0.2 + (e % 4) * 0.22, 0.83, 0.4 + Math.floor(e / 4) * 0.22);
    eMesh.castShadow = true;
    edamameGroup.add(eMesh);
  }
  root.add(edamameGroup);
  layers.push({ object: edamameGroup, initialY: 0.83, explodeMultiplier: 1.6 });

  // 6. Spicy Mayo Drizzle (Topping)
  const spicyMayoGroup = new THREE.Group();
  const mayoMat = new THREE.MeshPhysicalMaterial({
    color: '#FB7185',
    roughness: 0.2,
    metalness: 0.05,
    clearcoat: 0.8
  });
  const mayoCurve = new THREE.TorusGeometry(0.7, 0.04, 8, 32, Math.PI * 1.5);
  const mayoMesh = new THREE.Mesh(mayoCurve, mayoMat);
  mayoMesh.rotation.x = Math.PI / 2;
  mayoMesh.position.set(0, 0.98, 0);
  spicyMayoGroup.add(mayoMesh);
  root.add(spicyMayoGroup);
  toppingsMap.set('spicyMayo', spicyMayoGroup);
  layers.push({ object: spicyMayoGroup, initialY: 0.98, explodeMultiplier: 2.0, key: 'spicyMayo' });

  return { rootGroup: root, layers, toppingsMap };
}

/**
 * Procedural Ceremonial Matcha Boba Cloud:
 * 1. Frosted Ribbed Glass Cup
 * 2. Glossy Brown Sugar Tapioca Boba Pearls
 * 3. Layered Matcha Green Tea Liquid
 * 4. Fluffy Cloud Sea-Salt Foam
 * 5. Ice Cubes
 * 6. Bamboo Straw
 */
export function buildBobaModel(): FoodModelResult {
  const root = new THREE.Group();
  root.name = 'boba_root';
  const layers: ExplodedLayer[] = [];
  const toppingsMap = new Map<string, THREE.Object3D>();

  // 1. Coaster Base
  const coasterGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.08, 36);
  const coasterMat = new THREE.MeshStandardMaterial({
    color: '#E7E5E4',
    roughness: 0.8,
    metalness: 0.05
  });
  const coasterMesh = new THREE.Mesh(coasterGeo, coasterMat);
  coasterMesh.position.y = 0.04;
  coasterMesh.receiveShadow = true;
  root.add(coasterMesh);

  // 2. Glass Cup (Translucent)
  const glassGeo = new THREE.CylinderGeometry(1.2, 0.95, 2.5, 36, 1, true);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#FFFFFF',
    roughness: 0.15,
    transmission: 0.85,
    thickness: 0.8,
    transparent: true,
    opacity: 0.8,
    clearcoat: 1.0
  });
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.y = 1.35;
  glassMesh.receiveShadow = true;
  root.add(glassMesh);

  // 3. Boba Tapioca Pearls at the bottom
  const bobaGroup = new THREE.Group();
  const bobaMat = new THREE.MeshPhysicalMaterial({
    color: '#1C1917',
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 0.9
  });
  for (let b = 0; b < 24; b++) {
    const bGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const bMesh = new THREE.Mesh(bGeo, bobaMat);
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.75;
    bMesh.position.set(Math.cos(angle) * r, 0.25 + Math.random() * 0.45, Math.sin(angle) * r);
    bMesh.castShadow = true;
    bobaGroup.add(bMesh);
  }
  root.add(bobaGroup);
  layers.push({ object: bobaGroup, initialY: 0.35, explodeMultiplier: 0.4 });

  // Extra Boba Pearls (Topping)
  const extraBobaGroup = new THREE.Group();
  for (let eb = 0; eb < 16; eb++) {
    const ebGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const ebMesh = new THREE.Mesh(ebGeo, bobaMat);
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.75;
    ebMesh.position.set(Math.cos(angle) * r, 0.7 + Math.random() * 0.4, Math.sin(angle) * r);
    ebMesh.castShadow = true;
    extraBobaGroup.add(ebMesh);
  }
  root.add(extraBobaGroup);
  toppingsMap.set('extraBoba', extraBobaGroup);
  layers.push({ object: extraBobaGroup, initialY: 0.7, explodeMultiplier: 0.7, key: 'extraBoba' });

  // 4. Matcha Green Tea Liquid Body
  const liquidGroup = new THREE.Group();
  const liquidGeo = new THREE.CylinderGeometry(1.15, 0.92, 1.8, 36);
  const liquidMat = new THREE.MeshPhysicalMaterial({
    color: '#15803D',
    roughness: 0.3,
    transmission: 0.5,
    transparent: true,
    opacity: 0.9
  });
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.position.y = 1.15;
  liquidGroup.add(liquidMesh);
  root.add(liquidGroup);
  layers.push({ object: liquidGroup, initialY: 1.15, explodeMultiplier: 1.0 });

  // 5. Cloud Foam on top
  const foamGroup = new THREE.Group();
  const foamGeo = new THREE.CylinderGeometry(1.2, 1.15, 0.45, 36);
  const foamMat = new THREE.MeshPhysicalMaterial({
    color: '#FEF9C3',
    roughness: 0.5,
    clearcoat: 0.2
  });
  const foamMesh = new THREE.Mesh(foamGeo, foamMat);
  foamMesh.position.y = 2.15;
  foamGroup.add(foamMesh);
  root.add(foamGroup);
  toppingsMap.set('extraFoam', foamGroup);
  layers.push({ object: foamGroup, initialY: 2.15, explodeMultiplier: 1.6, key: 'extraFoam' });

  // 6. Bamboo Straw
  const strawGroup = new THREE.Group();
  const strawGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16);
  const strawMat = new THREE.MeshStandardMaterial({
    color: '#D4B996',
    roughness: 0.6,
    metalness: 0.05
  });
  const strawMesh = new THREE.Mesh(strawGeo, strawMat);
  strawMesh.position.set(0.3, 1.8, 0.2);
  strawMesh.rotation.z = -0.15;
  strawMesh.rotation.x = 0.1;
  strawMesh.castShadow = true;
  strawGroup.add(strawMesh);
  root.add(strawGroup);
  layers.push({ object: strawGroup, initialY: 1.8, explodeMultiplier: 2.2 });

  return { rootGroup: root, layers, toppingsMap };
}

/**
 * Procedural Baja Fish Taco Platter:
 * 1. Warm Stone-Ground Corn Tortillas (Trio)
 * 2. Golden Beer-Battered Fish Fillet
 * 3. Pickled Red Cabbage Slaw
 * 4. Chipotle Crema Drizzle
 * 5. Cilantro & Lime Wedges
 */
export function buildTacoModel(): FoodModelResult {
  const root = new THREE.Group();
  root.name = 'taco_root';
  const layers: ExplodedLayer[] = [];
  const toppingsMap = new Map<string, THREE.Object3D>();

  const plateTexture = createCeramicPlateTexture();

  // Serving Platter
  const platterGeo = new THREE.CylinderGeometry(2.4, 2.3, 0.1, 48);
  const platterMat = new THREE.MeshStandardMaterial({
    map: plateTexture,
    roughness: 0.7,
    metalness: 0.05
  });
  const platterMesh = new THREE.Mesh(platterGeo, platterMat);
  platterMesh.position.y = 0.05;
  platterMesh.receiveShadow = true;
  root.add(platterMesh);

  // Tortilla Shell (U-curve shape via bent cylinder)
  const tortillaGroup = new THREE.Group();
  const tortillaMat = new THREE.MeshStandardMaterial({
    color: '#FDE047',
    roughness: 0.75,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  // Main Taco
  const tGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.6, 24, 1, true, 0, Math.PI);
  const tMesh = new THREE.Mesh(tGeo, tortillaMat);
  tMesh.rotation.z = Math.PI / 2;
  tMesh.position.set(0, 0.7, 0);
  tMesh.castShadow = true;
  tortillaGroup.add(tMesh);
  root.add(tortillaGroup);
  layers.push({ object: tortillaGroup, initialY: 0.7, explodeMultiplier: 0.3 });

  // Golden Fish Fillet
  const fishGroup = new THREE.Group();
  const fishGeo = new THREE.BoxGeometry(0.65, 0.45, 1.5);
  const fishMat = new THREE.MeshStandardMaterial({
    color: '#D97706',
    roughness: 0.6,
    metalness: 0.1
  });
  const fishMesh = new THREE.Mesh(fishGeo, fishMat);
  fishMesh.position.set(0, 0.65, 0);
  fishMesh.castShadow = true;
  fishGroup.add(fishMesh);
  root.add(fishGroup);
  layers.push({ object: fishGroup, initialY: 0.65, explodeMultiplier: 0.7 });

  // Red Cabbage Slaw
  const slawGroup = new THREE.Group();
  const slawMat = new THREE.MeshStandardMaterial({
    color: '#9333EA',
    roughness: 0.5,
    metalness: 0.05
  });
  for (let c = 0; c < 12; c++) {
    const cGeo = new THREE.BoxGeometry(0.08, 0.08, 0.5);
    const cMesh = new THREE.Mesh(cGeo, slawMat);
    cMesh.position.set((Math.random() - 0.5) * 0.4, 0.9 + Math.random() * 0.2, (Math.random() - 0.5) * 1.2);
    cMesh.rotation.y = Math.random() * Math.PI;
    cMesh.castShadow = true;
    slawGroup.add(cMesh);
  }
  root.add(slawGroup);
  layers.push({ object: slawGroup, initialY: 0.95, explodeMultiplier: 1.2 });

  // Chipotle Crema Drizzle
  const drizzleGroup = new THREE.Group();
  const drizzleMat = new THREE.MeshPhysicalMaterial({
    color: '#F97316',
    roughness: 0.2,
    metalness: 0.05,
    clearcoat: 0.7
  });
  const drizzleGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 24);
  const drizzleMesh = new THREE.Mesh(drizzleGeo, drizzleMat);
  drizzleMesh.position.set(0, 1.1, 0);
  drizzleMesh.scale.set(0.6, 1.2, 1);
  drizzleGroup.add(drizzleMesh);
  root.add(drizzleGroup);
  layers.push({ object: drizzleGroup, initialY: 1.1, explodeMultiplier: 1.6 });

  // Lime Wedge on platter
  const limeGeo = new THREE.SphereGeometry(0.35, 12, 12, 0, Math.PI);
  const limeMat = new THREE.MeshStandardMaterial({
    color: '#84CC16',
    roughness: 0.35,
    metalness: 0.05
  });
  const limeMesh = new THREE.Mesh(limeGeo, limeMat);
  limeMesh.position.set(1.4, 0.2, 0.6);
  limeMesh.rotation.x = Math.PI / 2;
  limeMesh.castShadow = true;
  root.add(limeMesh);

  // Guacamole side (Topping)
  const guacGroup = new THREE.Group();
  const guacGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.25, 20);
  const guacMat = new THREE.MeshStandardMaterial({
    color: '#65A30D',
    roughness: 0.5,
    metalness: 0.02
  });
  const guacMesh = new THREE.Mesh(guacGeo, guacMat);
  guacMesh.position.set(-1.4, 0.18, 0.5);
  guacMesh.castShadow = true;
  guacGroup.add(guacMesh);
  root.add(guacGroup);
  toppingsMap.set('guacamole', guacGroup);
  layers.push({ object: guacGroup, initialY: 0.18, explodeMultiplier: 1.8, key: 'guacamole' });

  return { rootGroup: root, layers, toppingsMap };
}

export function buildFoodModelByType(type: 'burger' | 'pizza' | 'bowl' | 'boba' | 'taco'): FoodModelResult {
  switch (type) {
    case 'burger':
      return buildBurgerModel();
    case 'pizza':
      return buildPizzaModel();
    case 'bowl':
      return buildBowlModel();
    case 'boba':
      return buildBobaModel();
    case 'taco':
      return buildTacoModel();
    default:
      return buildBurgerModel();
  }
}
