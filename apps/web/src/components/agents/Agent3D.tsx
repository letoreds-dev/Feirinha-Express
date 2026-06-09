'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import * as THREE from 'three'
import type { AgentConfig, AgentStatus } from '../../../../../packages/agents/src/types'

interface Agent3DProps {
  config: AgentConfig
  status: AgentStatus
  onClick?: () => void
  onHover?: (hovered: boolean) => void
  isSelected?: boolean
}

// Avatar 3D estilizado low-poly
export function Agent3D({ config, status, onClick, onHover, isSelected }: Agent3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  // Animações baseadas no status
  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()

    // Bobbing animation baseado no status
    if (status === 'working') {
      // Balançando para frente e trás (digitando)
      groupRef.current.rotation.x = Math.sin(time * 3) * 0.1
      groupRef.current.position.y = Math.sin(time * 2) * 0.05
    } else if (status === 'thinking') {
      // Pensando - movimento mais lento
      groupRef.current.position.y = 0.5 + Math.sin(time * 0.5) * 0.1
    } else if (status === 'idle') {
      // Idle - movimento sutil
      groupRef.current.position.y = 0.5 + Math.sin(time) * 0.02
    } else {
      // Meeting - parado
      groupRef.current.position.y = 0.5
    }

    // Hover effect
    if (meshRef.current) {
      const targetScale = hovered || isSelected ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  // Cor baseada no status
  const statusColor = useMemo(() => {
    switch (status) {
      case 'working':
        return '#10B981' // Verde - trabalhando
      case 'thinking':
        return '#F59E0B' // Amarelo - pensando
      case 'meeting':
        return '#3B82F6' // Azul - em reunião
      default:
        return '#94A3B8' // Cinza - idle
    }
  }, [status])

  // Posição do agente (acima da estação de trabalho)
  const position: [number, number, number] = [
    config.position.x,
    0.5,
    config.position.z
  ]

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover?.(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHovered(false)
        onHover?.(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Corpo principal - estilo voxel/low-poly */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial
          color={config.color}
          roughness={0.4}
          metalness={0.1}
          emissive={isSelected ? config.color : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Cabeça */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#fcd9b6" roughness={0.8} />
      </mesh>

      {/* Indicador de status */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Braços (só visíveis quando working) */}
      {status === 'working' && (
        <>
          <mesh position={[0.4, 0.1, 0]} rotation={[0, 0, -0.3]} castShadow>
            <boxGeometry args={[0.15, 0.5, 0.15]} />
            <meshStandardMaterial color="#fcd9b6" roughness={0.8} />
          </mesh>
          <mesh position={[-0.4, 0.1, 0]} rotation={[0, 0, 0.3]} castShadow>
            <boxGeometry args={[0.15, 0.5, 0.15]} />
            <meshStandardMaterial color="#fcd9b6" roughness={0.8} />
          </mesh>
        </>
      )}

      {/* Pernas */}
      <mesh position={[0.15, -0.5, 0]} castShadow>
        <boxGeometry args={[0.18, 0.4, 0.25]} />
        <meshStandardMaterial color="#1f1a17" roughness={0.9} />
      </mesh>
      <mesh position={[-0.15, -0.5, 0]} castShadow>
        <boxGeometry args={[0.18, 0.4, 0.25]} />
        <meshStandardMaterial color="#1f1a17" roughness={0.9} />
      </mesh>

      {/* Nome e cargo - HTML overlay */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 1.5, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-brand-line">
            <div className="font-bold text-brand-ink text-sm">{config.name}</div>
            <div className="text-xs text-brand-muted">{config.title}</div>
            <div className="text-xs mt-1 font-medium" style={{ color: statusColor }}>
              {status === 'working' ? '💻 Trabalhando' : status === 'thinking' ? '🤔 Pensando' : '⏸️ Disponível'}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}