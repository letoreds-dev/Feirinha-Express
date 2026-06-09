'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { Agent3D } from './Agent3D'
import { Workstation } from './Workstation'
import type { AgentConfig, AgentStatus } from '../../../../../packages/agents/src/types'

interface OfficeEnvironmentProps {
  agents: AgentConfig[]
  agentStatuses: Record<string, AgentStatus>
  onAgentClick?: (agentId: string) => void
  onAgentHover?: (agentId: string | null) => void
  selectedAgent?: string | null
}

// Componente do chão/piso do escritório
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[30, 20]} />
      <meshStandardMaterial color="#faf8f5" roughness={0.8} />
    </mesh>
  )
}

// Grade de carpete
function Carpet() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[14, 10]} />
      <meshStandardMaterial color="#e8e0d8" roughness={0.9} />
    </mesh>
  )
}

// Paredes do escritório
function Walls() {
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fffaf4',
        roughness: 0.9,
        side: THREE.DoubleSide
      }),
    []
  )

  return (
    <group>
      {/* Parede de trás */}
      <mesh position={[0, 3, -8]} receiveShadow>
        <boxGeometry args={[30, 6, 0.2]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Parede lateral esquerda */}
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[16, 6, 0.2]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Parede lateral direita */}
      <mesh position={[15, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[16, 6, 0.2]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
    </group>
  )
}

// Área central (sala de reuniões)
function CentralArea() {
  return (
    <group position={[0, 0, 0]}>
      {/* Mesa de reuniões */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.1, 32]} />
        <meshStandardMaterial color="#8B5CF6" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Pernas da mesa */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 2.2
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
            <meshStandardMaterial color="#1f1a17" roughness={0.5} />
          </mesh>
        )
      })}

      {/* Cadeiras ao redor */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6
        const radius = 3.5
        return (
          <group
            key={i}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle + Math.PI, 0]}
          >
            {/* Assento */}
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.6, 0.1, 0.6]} />
              <meshStandardMaterial color="#1f1a17" roughness={0.8} />
            </mesh>
            {/* Encosto */}
            <mesh position={[0, 0.75, -0.25]} castShadow>
              <boxGeometry args={[0.6, 0.6, 0.1]} />
              <meshStandardMaterial color="#1f1a17" roughness={0.8} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// Decoração do escritório
function Decorations() {
  return (
    <group>
      {/* Planta 1 */}
      <group position={[-12, 0, -6]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.3, 0.8, 8]} />
          <meshStandardMaterial color="#8B5CF6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#10B981" roughness={0.8} />
        </mesh>
      </group>

      {/* Planta 2 */}
      <group position={[12, 0, -6]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color="#F97316" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1, 0]} castShadow>
          <coneGeometry args={[0.4, 0.8, 8]} />
          <meshStandardMaterial color="#10B981" roughness={0.8} />
        </mesh>
      </group>

      {/* Relógio na parede */}
      <mesh position={[0, 5, -7.9]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial color="#fffaf4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 5, -7.85]}>
        <circleGeometry args={[0.7, 32]} />
        <meshStandardMaterial color="#ea1d2c" roughness={0.3} />
      </mesh>
    </group>
  )
}

// Iluminação
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 8, 0]} intensity={0.3} color="#fff5eb" />
      {/* Luzes suspensas sobre cada estação */}
      <pointLight position={[-4, 4, 2]} intensity={0.2} color="#F97316" />
      <pointLight position={[4, 4, 2]} intensity={0.2} color="#06B6D4" />
      <pointLight position={[-4, 4, -2]} intensity={0.2} color="#EC4899" />
      <pointLight position={[4, 4, -2]} intensity={0.2} color="#10B981" />
      <pointLight position={[0, 4, 0]} intensity={0.3} color="#8B5CF6" />
    </>
  )
}

// Cena principal do escritório
function OfficeScene({
  agents,
  agentStatuses,
  onAgentClick,
  onAgentHover,
  selectedAgent
}: OfficeEnvironmentProps) {
  return (
    <group>
      <Floor />
      <Carpet />
      <Walls />
      <CentralArea />
      <Decorations />
      <Lighting />

      {/* Estações de trabalho e agentes */}
      {agents.map((agent) => (
        <group key={agent.id}>
          {/* Estações de trabalho */}
          <Workstation type={agent.workstation} position={agent.position} color={agent.color} />

          {/* Agente 3D */}
          <Agent3D
            config={agent}
            status={agentStatuses[agent.id] || 'idle'}
            onClick={() => onAgentClick?.(agent.id)}
            onHover={(hovered) => onAgentHover?.(hovered ? agent.id : null)}
            isSelected={selectedAgent === agent.id}
          />
        </group>
      ))}
    </group>
  )
}

export function OfficeEnvironment(props: OfficeEnvironmentProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 12, 15]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={10}
          maxDistance={30}
          target={[0, 0, 0]}
        />
        <Environment preset="city" />
        <OfficeScene {...props} />
      </Canvas>
    </div>
  )
}