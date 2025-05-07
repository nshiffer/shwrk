/**
 * Artistic Light Ray Installation
 * A modern art piece that flows through the website with fluid, organic motion
 * Author: Claude
 */

class ArtisticLightRay {
    constructor() {
        this.initialized = false;
        this.time = 0;
        this.scrollY = 0;
        this.targetScrollY = 0;
        
        // Load dependencies
        this.loadDependencies([
            'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',
            'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/EffectComposer.js',
            'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/RenderPass.js',
            'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/ShaderPass.js',
            'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/UnrealBloomPass.js',
            'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/shaders/LuminosityHighPassShader.js',
            'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/shaders/CopyShader.js',
            'https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js'
        ]);
    }
    
    loadDependencies(scripts) {
        let loadedCount = 0;
        
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === scripts.length) {
                    this.init();
                }
            };
            document.head.appendChild(script);
        });
    }
    
    init() {
        console.log('Initializing artistic light ray...');
        
        // Canvas elements
        this.rayCanvas = document.getElementById('light-ray-canvas');
        this.glowCanvas = document.getElementById('light-glow-canvas');
        this.particlesCanvas = document.getElementById('light-particles-canvas');
        
        if (!this.rayCanvas || !this.glowCanvas || !this.particlesCanvas) {
            console.error('Canvas elements not found');
            return;
        }
        
        // Initialize simplex noise
        this.simplex = new SimplexNoise();
        
        // Set up camera & scenes
        this.setupCamera();
        this.setupScenes();
        this.setupRenderers();
        this.setupEffects();
        this.createArtwork();
        
        // Event listeners
        window.addEventListener('scroll', () => {
            this.targetScrollY = window.scrollY;
        });
        
        window.addEventListener('resize', () => this.handleResize());
        
        // Interactive elements - make light ray respond to site content
        this.setupInteractions();
        
        // Start animation
        this.initialized = true;
        this.animate();
        
        // Fade in the canvases after a short delay
        setTimeout(() => {
            this.rayCanvas.style.opacity = '1';
            this.glowCanvas.style.opacity = '1';
            this.particlesCanvas.style.opacity = '1';
        }, 800);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(0, 0, 120);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupScenes() {
        this.rayScene = new THREE.Scene();
        this.glowScene = new THREE.Scene();
        this.particlesScene = new THREE.Scene();
    }
    
    setupRenderers() {
        const createRenderer = (canvas) => {
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.outputEncoding = THREE.sRGBEncoding;
            return renderer;
        };
        
        this.rayRenderer = createRenderer(this.rayCanvas);
        this.glowRenderer = createRenderer(this.glowCanvas);
        this.particlesRenderer = createRenderer(this.particlesCanvas);
    }
    
    setupEffects() {
        const createComposer = (renderer, scene) => {
            const renderPass = new THREE.RenderPass(scene, this.camera);
            
            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.3,   // Strength - significantly reduced
                0.2,   // Radius - reduced further
                0.3    // Threshold - increased to make fewer elements bloom
            );
            
            const composer = new THREE.EffectComposer(renderer);
            composer.addPass(renderPass);
            composer.addPass(bloomPass);
            
            return composer;
        };
        
        this.rayComposer = createComposer(this.rayRenderer, this.rayScene);
        this.glowComposer = createComposer(this.glowRenderer, this.glowScene);
        this.particlesComposer = createComposer(this.particlesRenderer, this.particlesScene);
    }
    
    createArtwork() {
        // Create ray shader material
        this.rayMaterial = this.createRayMaterial();
        
        // Create glow material - more subtle color aligned with site palette
        this.glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x0A3D62, // Darker navy to match site theme
            transparent: true,
            opacity: 0.08, // Much more subtle
            blending: THREE.AdditiveBlending
        });
        
        // Create main light ray - make it significantly thinner for a more minimal look
        this.mainRay = this.createLightRay(this.rayScene, this.rayMaterial, 1.2);
        
        // Create glow effect around the ray - also thinner
        this.glowRay = this.createLightRay(this.glowScene, this.glowMaterial, 2.5);
        
        // Create particle system - far fewer particles for minimalism
        this.particleSystem = this.createParticleSystem(this.particlesScene, 120);
    }
    
    createRayMaterial() {
        // Custom shader for artistic light ray - refined color scheme aligned with site
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color('#051322') }, // Darkest navy (almost black)
                color2: { value: new THREE.Color('#0A3D62') }, // Dark navy
                color3: { value: new THREE.Color('#1A4A73') }, // Medium navy
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                uniform vec2 resolution;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                // A fluid, organic gradient based on position and time
                void main() {
                    // Create a fluid motion effect with sine waves
                    float wave1 = sin(vUv.x * 10.0 + time * 0.4) * 0.5 + 0.5; // Slowed down
                    float wave2 = sin(vUv.y * 8.0 + time * 0.3) * 0.5 + 0.5; // Slowed down
                    float wave3 = sin(vUv.x * 5.0 + vUv.y * 6.0 + time * 0.2) * 0.5 + 0.5; // Slowed down
                    
                    // Combine waves for a fluid effect
                    float fluid = wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3;
                    
                    // Create dynamic color mixing
                    vec3 finalColor = mix(color1, color2, fluid);
                    finalColor = mix(finalColor, color3, sin(time * 0.15) * 0.5 + 0.5); // Slowed down
                    
                    // Edge glow effect - stronger fade for more defined edges
                    float edgeGlow = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0) * pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0);
                    
                    // Apply a soft edge falloff with lower opacity
                    float alpha = smoothstep(0.0, 0.3, edgeGlow) * 0.7; // More transparent
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });
    }
    
    setupInteractions() {
        // Find all ray-card elements for hover interactions
        const rayCards = document.querySelectorAll('.ray-card');
        const raySections = document.querySelectorAll('.ray-section');
        
        // Interactive attraction/repulsion influence points
        this.interactionPoints = [];
        
        // Add hover effect to project cards
        rayCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // Add an attraction point
                this.interactionPoints.push({
                    x: centerX - window.innerWidth / 2,
                    y: centerY - window.innerHeight / 2,
                    z: 20, // Bring ray towards viewer near cards
                    strength: 25,
                    decay: 0.02,
                    timeAdded: this.time
                });
            });
        });
        
        // Add subtle influence based on visible sections
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const rect = entry.target.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    // Add a gentle influence point
                    this.interactionPoints.push({
                        x: centerX - window.innerWidth / 2,
                        y: centerY - window.innerHeight / 2,
                        z: 10, // Subtle influence on z
                        strength: 15,
                        decay: 0.01,
                        timeAdded: this.time
                    });
                }
            });
        }, observerOptions);
        
        raySections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    createOrganicPath(time, scrollFactor) {
        const pathPoints = [];
        const segments = 12;
        
        // Apply influence from interaction points
        const calculateInfluence = (x, y, z) => {
            let influenceX = 0;
            let influenceY = 0;
            let influenceZ = 0;
            
            if (this.interactionPoints && this.interactionPoints.length > 0) {
                // Remove expired influence points
                this.interactionPoints = this.interactionPoints.filter(point => {
                    const age = time - point.timeAdded;
                    return age < 5; // Remove after 5 time units
                });
                
                // Calculate influence from remaining points
                this.interactionPoints.forEach(point => {
                    const age = time - point.timeAdded;
                    const strength = point.strength * Math.exp(-point.decay * age * 10);
                    
                    const dx = point.x - x;
                    const dy = point.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        const factor = strength / (1 + distance * 0.1);
                        influenceX += (dx / distance) * factor;
                        influenceY += (dy / distance) * factor;
                        influenceZ += (point.z / distance) * factor;
                    }
                });
            }
            
            return { x: influenceX, y: influenceY, z: influenceZ };
        };
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            
            // Use simplex noise for organic variation - reduced amplitude for minimalism
            const noiseT = time * 0.08; // Slower noise movement
            const noiseX = this.simplex.noise3D(t * 1.5, noiseT, scrollFactor * 0.08) * 20; // Reduced movement
            const noiseY = this.simplex.noise3D(t * 1.5 + 1, noiseT + 100, scrollFactor * 0.12) * 15; // Reduced movement
            
            // Create a flowing path - narrower overall trajectory
            const x = (t * 2 - 1) * 80 + noiseX; // Reduced range
            const y = Math.sin(t * Math.PI * 1.5) * 15 + noiseY; // Reduced amplitude
            
            // Z-coordinate determines depth (in/out of page) - reduced range for more subtlety
            const zBase = Math.sin(t * Math.PI * 2 + time * 0.15) * 12; // Reduced z movement
            const zNoise = this.simplex.noise3D(t * 2, noiseT + 200, scrollFactor * 0.15) * 8; // Reduced z noise
            const z = zBase + zNoise;
            
            // Apply interaction influence
            const influence = calculateInfluence(x, y, z);
            
            pathPoints.push(new THREE.Vector3(
                x + influence.x,
                y + influence.y,
                z + influence.z
            ));
        }
        
        const curve = new THREE.CatmullRomCurve3(pathPoints);
        curve.closed = false;
        
        return curve;
    }
    
    createLightRay(scene, material, radius) {
        const initialCurve = this.createOrganicPath(0, 0);
        const geometry = new THREE.TubeGeometry(initialCurve, 200, radius, 12, false);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        return {
            mesh,
            update: (time, scrollFactor) => {
                const newCurve = this.createOrganicPath(time, scrollFactor);
                mesh.geometry.dispose();
                mesh.geometry = new THREE.TubeGeometry(newCurve, 200, radius, 12, false);
                
                if (material.uniforms && material.uniforms.time) {
                    material.uniforms.time.value = time;
                }
                
                return newCurve;
            }
        };
    }
    
    createParticleSystem(scene, count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            // Initialize positions (will be updated in animation loop)
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            
            // Colors - refined to match site's monochromatic navy theme
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i * 3] = 0.02; // R
                colors[i * 3 + 1] = 0.08; // G
                colors[i * 3 + 2] = 0.2; // B
            } else if (colorChoice < 0.66) {
                colors[i * 3] = 0.04; // R
                colors[i * 3 + 1] = 0.15; // G
                colors[i * 3 + 2] = 0.3; // B
            } else {
                colors[i * 3] = 0.06; // R
                colors[i * 3 + 1] = 0.22; // G
                colors[i * 3 + 2] = 0.4; // B
            }
            
            // Random sizes - much smaller for subtle effect
            sizes[i] = Math.random() * 0.8 + 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Particle shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform float pixelRatio;
                
                void main() {
                    vColor = color;
                    
                    // Subtle pulsing size variation - reduced pulsing
                    float pulseFactor = sin(time * 0.08 + position.x * 0.03 + position.y * 0.03) * 0.3 + 1.2;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * pulseFactor * (1000.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Create a soft, glowing particle
                    float distanceToCenter = length(gl_PointCoord - vec2(0.5, 0.5));
                    float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    gl_FragColor = vec4(vColor, strength * 0.6); // More transparent
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        
        return {
            particles,
            update: (time, curve) => {
                const positions = particles.geometry.attributes.position.array;
                const count = positions.length / 3;
                
                for (let i = 0; i < count; i++) {
                    // Position particles along the curve with some randomness
                    const curveT = (i / count) * 0.95 + Math.random() * 0.05;
                    const pointOnCurve = curve.getPointAt(curveT);
                    
                    // Add some random offset from the curve centerline
                    const tangent = curve.getTangentAt(curveT);
                    const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
                    const binormal = new THREE.Vector3().crossVectors(tangent, normal);
                    
                    const randomOffset = 5; // Reduced offset for tighter grouping
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * randomOffset;
                    
                    positions[i * 3] = pointOnCurve.x + Math.cos(angle) * normal.x * radius + Math.sin(angle) * binormal.x * radius;
                    positions[i * 3 + 1] = pointOnCurve.y + Math.cos(angle) * normal.y * radius + Math.sin(angle) * binormal.y * radius;
                    positions[i * 3 + 2] = pointOnCurve.z + Math.cos(angle) * normal.z * radius + Math.sin(angle) * binormal.z * radius;
                }
                
                particles.geometry.attributes.position.needsUpdate = true;
                particles.material.uniforms.time.value = time;
            }
        };
    }
    
    updateZIndices(curve, time) {
        // Sample points along the curve to determine z-indices
        const numSamples = 5;
        const zPositions = [];
        
        for (let i = 0; i < numSamples; i++) {
            const t = i / (numSamples - 1);
            const point = curve.getPointAt(t);
            zPositions.push(point.z);
        }
        
        // Determine which sections should be in front vs behind
        const frontSections = zPositions.filter(z => z > 0).length;
        const ratio = frontSections / numSamples;
        
        // Variable z-index along different sections of the ray - better integrated with site content
        if (ratio > 0.7) {
            // Only show in front when strongly in front - make it more subtle
            this.rayCanvas.style.zIndex = '5';
            this.glowCanvas.style.zIndex = '22';
            this.particlesCanvas.style.zIndex = '23';
        } else if (ratio > 0.4) {
            // Mixed - some parts in front, some behind
            this.rayCanvas.style.zIndex = '5';
            this.glowCanvas.style.zIndex = '18';
            this.particlesCanvas.style.zIndex = '19';
        } else {
            // More sections behind - move everything behind content
            this.rayCanvas.style.zIndex = '3';
            this.glowCanvas.style.zIndex = '4';
            this.particlesCanvas.style.zIndex = '5';
        }
        
        // Adjust opacity for added subtlety - much more transparent overall
        const baseOpacity = 0.65; // Reduced
        const opacityVariation = Math.sin(time * 0.15) * 0.05 + 0.08; // Less variation
        
        this.rayCanvas.style.opacity = (baseOpacity - opacityVariation).toFixed(2);
        this.glowCanvas.style.opacity = (0.25 - opacityVariation).toFixed(2); // Reduced
        this.particlesCanvas.style.opacity = (0.2 - opacityVariation).toFixed(2); // Reduced
    }
    
    updateColorPalette(time) {
        // Evolving, fluid color palette - refined to match site's dark navy scheme
        const cycleDuration = 60; // longer cycles for subtlety
        const palette = [
            // Dark navy blues from the site's theme
            { main: '#051322', alt: '#0A3D62', accent: '#1A4A73' }, // Darker tones
            // Slightly cooler navy blues
            { main: '#061526', alt: '#0D3B5C', accent: '#164267' },
            // Slightly warmer navy blues
            { main: '#07162B', alt: '#0E2F4D', accent: '#144368' }
        ];
        
        const cyclePos = (time % cycleDuration) / cycleDuration;
        const paletteIndex = Math.floor(cyclePos * palette.length);
        const nextIndex = (paletteIndex + 1) % palette.length;
        const mixRatio = (cyclePos * palette.length) % 1;
        
        // Interpolate between palettes
        const lerpColor = (color1, color2, ratio) => {
            const c1 = new THREE.Color(color1);
            const c2 = new THREE.Color(color2);
            return c1.lerp(c2, ratio);
        };
        
        // Update shader material colors
        if (this.rayMaterial.uniforms) {
            this.rayMaterial.uniforms.color1.value = lerpColor(
                palette[paletteIndex].main,
                palette[nextIndex].main,
                mixRatio
            );
            this.rayMaterial.uniforms.color2.value = lerpColor(
                palette[paletteIndex].alt,
                palette[nextIndex].alt,
                mixRatio
            );
            this.rayMaterial.uniforms.color3.value = lerpColor(
                palette[paletteIndex].accent,
                palette[nextIndex].accent,
                mixRatio
            );
        }
        
        // Update glow material color
        this.glowMaterial.color = lerpColor(
            palette[paletteIndex].alt, 
            palette[nextIndex].alt,
            mixRatio
        );
    }
    
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update camera
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        // Update renderers
        this.rayRenderer.setSize(width, height);
        this.glowRenderer.setSize(width, height);
        this.particlesRenderer.setSize(width, height);
        
        // Update composers
        this.rayComposer.setSize(width, height);
        this.glowComposer.setSize(width, height);
        this.particlesComposer.setSize(width, height);
        
        // Update resolution uniform
        if (this.rayMaterial.uniforms && this.rayMaterial.uniforms.resolution) {
            this.rayMaterial.uniforms.resolution.value.set(width, height);
        }
    }
    
    animate() {
        if (!this.initialized) return;
        
        requestAnimationFrame(() => this.animate());
        
        // Smooth scroll following - even slower for more subtlety
        this.scrollY += (this.targetScrollY - this.scrollY) * 0.015; // Slower response
        const scrollFactor = this.scrollY * 0.0004; // Reduced scroll influence
        
        // Update time - slower for more subtle animation
        this.time += 0.003; // Slower animation
        
        // Update color palette
        this.updateColorPalette(this.time);
        
        // Update the light ray elements
        const updatedCurve = this.mainRay.update(this.time, scrollFactor);
        this.glowRay.update(this.time + 0.2, scrollFactor * 1.1);
        this.particleSystem.update(this.time, updatedCurve);
        
        // Update z-indices to make ray weave through content
        this.updateZIndices(updatedCurve, this.time);
        
        // Subtle camera movement - minimized for more stability
        const cameraAmplitude = 1.5; // Reduced camera movement
        this.camera.position.x = Math.sin(this.time * 0.03) * cameraAmplitude;
        this.camera.position.y = Math.cos(this.time * 0.04) * cameraAmplitude;
        this.camera.lookAt(0, 0, 0);
        
        // Render the scenes
        this.rayComposer.render();
        this.glowComposer.render();
        this.particlesComposer.render();
    }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const artInstallation = new ArtisticLightRay();
});
