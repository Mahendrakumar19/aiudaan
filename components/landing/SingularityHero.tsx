'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function SingularityHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    // Setup Three.js
    const container = containerRef.current
    const canvas = canvasRef.current
    
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || 600

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    camera.position.set(50, 25, 50)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: true
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;

    // Singularity Core Group
    const coreGroup = new THREE.Group()
    scene.add(coreGroup)

    const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const bhGeo = new THREE.SphereGeometry(4, 64, 64)
    const bhMesh = new THREE.Mesh(bhGeo, bhMat)
    coreGroup.add(bhMesh)

    // Glow Aura
    const auraMat = new THREE.ShaderMaterial({
      uniforms: { 
        uTime: { value: 0 }, 
        uIntensity: { value: 1.0 } 
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vView = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 4.0);
          gl_FragColor = vec4(vec3(0.2, 0.5, 1.0) * rim * uIntensity * 6.0, 1.0);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
    const auraMesh = new THREE.Mesh(new THREE.SphereGeometry(4.25, 64, 64), auraMat)
    coreGroup.add(auraMesh)

    // Noise definitions
    const noiseChunk = `
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
    `

    // Instanced Accretion Disk particles
    const instanceCount = 4000
    const streakGeo = new THREE.CylinderGeometry(0.01, 0.14, 2.5, 3)
    streakGeo.rotateX(Math.PI / 2)

    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0.15 },
        uCompression: { value: 1.0 },
        uIntensity: { value: 1.2 },
        uOrbitScale: { value: 1.0 }
      },
      vertexShader: `
        ${noiseChunk}
        uniform float uTime;
        uniform float uMorph;
        uniform float uCompression;
        uniform float uIntensity;
        uniform float uOrbitScale;
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float rOriginal = length(instPos.xz);
          float r = rOriginal * uCompression;
          float initialAngle = atan(instPos.z, instPos.x);
          float orbitalVelocity = (1.5 / sqrt(rOriginal)) * uOrbitScale;
          float currentAngle = initialAngle + (uTime * orbitalVelocity);
          vec3 morphedWorldPos = vec3(cos(currentAngle) * r, instPos.y, sin(currentAngle) * r);
          float noise = snoise(vec3(morphedWorldPos.x * 0.08, morphedWorldPos.z * 0.08, uTime * 0.3));
          morphedWorldPos.y += noise * uMorph * 4.0;
          vec3 viewDir = normalize(cameraPosition - morphedWorldPos);
          vec3 orbitDir = normalize(vec3(-sin(currentAngle), 0.0, cos(currentAngle)));
          float doppler = dot(orbitDir, viewDir);
          
          vec3 hot = vec3(0.0, 0.95, 1.0);
          vec3 warm = vec3(0.2, 0.38, 0.95);
          vec3 cool = vec3(0.58, 0.08, 0.95);
          
          vec3 color = mix(cool, warm, smoothstep(45.0, 12.0, r));
          color = mix(color, hot, smoothstep(10.0, 4.0, r));
          vColor = color * (1.3 + doppler * 0.7) * uIntensity;
          vOpacity = (smoothstep(3.8, 5.5, r) * (1.0 - smoothstep(38.0, 48.0, r))) * 0.85;
          
          float deltaAngle = currentAngle - initialAngle;
          float c = cos(deltaAngle);
          float s = sin(deltaAngle);
          mat3 rotY = mat3(
            c, 0, s,
            0, 1, 0,
            -s, 0, c
          );
          vec3 localPos = (instanceMatrix * vec4(position, 0.0)).xyz;
          vec3 rotatedLocalPos = rotY * localPos;
          gl_Position = projectionMatrix * viewMatrix * vec4(morphedWorldPos + rotatedLocalPos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          gl_FragColor = vec4(vColor, vOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const instancedDisk = new THREE.InstancedMesh(streakGeo, diskMaterial, instanceCount)
    const dummy = new THREE.Object3D()

    for (let i = 0; i < instanceCount; i++) {
      const r = 5 + Math.pow(Math.random(), 1.3) * 40
      const angle = Math.random() * Math.PI * 2
      dummy.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * (8 / r), Math.sin(angle) * r)
      dummy.lookAt(dummy.position.x + Math.sin(angle), dummy.position.y, dummy.position.z - Math.cos(angle))
      dummy.updateMatrix()
      instancedDisk.setMatrixAt(i, dummy.matrix)
    }
    scene.add(instancedDisk)

    // GSAP Interactive Scroll Animation Mapping
    const scrollControl = {
      progress: 0,
      morph: 0.15,
      compress: 1.0,
      intensity: 1.2,
      orbitScale: 1.0,
      camX: 50,
      camY: 25,
      camZ: 50
    }

    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: 0.5
      }
    })

    // Animation frames morphing
    scrollTimeline.to(scrollControl, {
      morph: 3.8,
      compress: 0.65,
      intensity: 2.8,
      orbitScale: 2.5,
      camX: 30,
      camY: 45,
      camZ: 30,
      ease: "power1.inOut",
      onUpdate: () => {
        diskMaterial.uniforms.uMorph.value = scrollControl.morph
        diskMaterial.uniforms.uCompression.value = scrollControl.compress
        diskMaterial.uniforms.uIntensity.value = scrollControl.intensity
        diskMaterial.uniforms.uOrbitScale.value = scrollControl.orbitScale
        
        camera.position.set(scrollControl.camX, scrollControl.camY, scrollControl.camZ)
        camera.lookAt(0, 0, 0)
      }
    }, 0)

    // Y2K Text Split
    scrollTimeline.fromTo("#rowA", { yPercent: 0, opacity: 1 }, { yPercent: -120, opacity: 0, ease: "power2.in" }, 0)
    scrollTimeline.fromTo("#rowB", { yPercent: 0, opacity: 1 }, { yPercent: 120, opacity: 0, ease: "power2.in" }, 0)

    // Badges Scatter
    scrollTimeline.fromTo("#badgeL", { x: 0, opacity: 1 }, { x: -150, opacity: 0, ease: "power2.in" }, 0)
    scrollTimeline.fromTo("#badgeR", { x: 0, opacity: 1 }, { x: 150, opacity: 0, ease: "power2.in" }, 0)
    scrollTimeline.fromTo("#badgeC", { y: 0, opacity: 1 }, { y: -100, opacity: 0, ease: "power2.in" }, 0)

    // Brackets contract
    scrollTimeline.fromTo(["#bracketTL", "#bracketBR"], { scale: 1, opacity: 1 }, { scale: 0.6, opacity: 0, ease: "power2.in" }, 0)
    scrollTimeline.fromTo(["#bracketTR", "#bracketBL"], { scale: 1, opacity: 1 }, { scale: 0.6, opacity: 0, ease: "power2.in" }, 0)

    // Year HUD increment
    const yearHud = document.getElementById("hudYearIndex")
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=120%",
      scrub: true,
      onUpdate: (self) => {
        if (yearHud) {
          const year = Math.round(2020 + self.progress * 6)
          yearHud.textContent = String(year)
        }
      }
    })

    // Animation Loop
    const clock = new THREE.Clock()
    let animationId: number

    const tick = () => {
      const time = clock.getElapsedTime()
      diskMaterial.uniforms.uTime.value = time
      instancedDisk.rotation.y += 0.0006
      coreGroup.rotation.y -= 0.0002

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(tick)
    }

    tick()

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth || window.innerWidth
      const h = containerRef.current.clientHeight || 600

      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      
      // Dispose resources
      streakGeo.dispose()
      diskMaterial.dispose()
      bhGeo.dispose()
      bhMat.dispose()
      auraMat.dispose()
      renderer.dispose()

      if (ScrollTrigger.getById("hero-trigger")) {
        ScrollTrigger.getById("hero-trigger")?.kill()
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-slate-950 flex flex-col justify-between select-none -mt-24"
    >
      {/* 3D Singularity Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 w-full h-full block" 
      />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)] opacity-80" />

      {/* Futuristic Scanlines */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-40 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.15)_3px,rgba(0,0,0,0.15)_4px)]" />

      {/* Corner brackets */}
      <div className="absolute inset-6 sm:inset-10 z-20 pointer-events-none">
        <div id="bracketTL" className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-cyan-400" />
        <div id="bracketTR" className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-cyan-400" />
        <div id="bracketBL" className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-cyan-400" />
        <div id="bracketBR" className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-cyan-400" />
      </div>

      {/* Center text row split */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center px-4">
        <div className="hero-title select-none font-syne font-black text-white leading-none tracking-tighter">
          <div className="overflow-hidden h-[1.1em] text-5xl sm:text-7xl md:text-8xl">
            <span id="rowA" className="inline-block bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              AI UDAAN
            </span>
          </div>
          <div className="overflow-hidden h-[1.1em] mt-2 sm:mt-4 text-4xl sm:text-6xl md:text-7xl">
            <span id="rowB" className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              BOOTCAMP 2026
            </span>
          </div>
        </div>
      </div>

      {/* Y2K Badges */}
      <div id="badgeL" className="absolute top-[22%] left-[8%] z-20 px-4 py-2 bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 rounded-full text-xs font-bold font-mono tracking-widest hidden md:block">
        ★ UP-SKILLING
      </div>
      <div id="badgeR" className="absolute top-[18%] right-[8%] z-20 px-4 py-2 bg-indigo-500/10 border border-indigo-400/40 text-indigo-400 rounded-full text-xs font-bold font-mono tracking-widest hidden md:block">
        INTERNSHIPS ★
      </div>
      <div id="badgeC" className="absolute bottom-[28%] left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 bg-white text-slate-950 border-2 border-slate-900 rounded-full text-xs font-black tracking-widest pointer-events-auto cursor-pointer hover:bg-slate-100 shadow-md">
        EXPLORE PROGRAM ↓
      </div>

      {/* Bottom HUD bar */}
      <div className="absolute bottom-0 left-0 w-full z-20 p-6 sm:px-12 flex items-center justify-between pointer-events-none font-mono text-[10px] text-slate-400 bg-gradient-to-t from-slate-950/80 to-transparent">
        <span>SCROLL TO EXPLORE ACCRETION FLOW</span>
        <div className="flex-1 h-px bg-slate-800/60 mx-6" />
        <div>
          <span>YEAR: </span>
          <span id="hudYearIndex" className="text-cyan-400 font-bold">2020</span>
        </div>
      </div>
    </div>
  )
}
