'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import type { WorkstationType } from '../../../../../packages/agents/src/types'

interface WorkstationProps {
  type: WorkstationType
  position: { x: number; y: number; z: number }
  color: string
}

// Mesa base para todas as estações
function BaseDesk({ color }: { color: string }) {
  return (
    <group>
      {/* Tampo da mesa */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.08, 1]} />
        <meshStandardMaterial color="#1f1a17" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Pernas */}
      {[
        [-0.8, 0, 0.4],
        [0.8, 0, 0.4],
        [-0.8, 0, -0.4],
        [0.8, 0, -0.4]
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0] as number, 0.4, pos[2] as number]} castShadow>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#1f1a17" roughness={0.5} />
        </mesh>
      ))}

      {/* Tapete decorativo */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.9} opacity={0.3} transparent />
      </mesh>
    </group>
  )
}

// Estação do CEO - mesa executiva
function ExecutiveDesk({ color }: { color: string }) {
  return (
    <group>
      <BaseDesk color={color} />

      {/* Monitor grande */}
      <mesh position={[0, 1.3, -0.3]} castShadow>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.3, -0.27]}>
        <planeGeometry args={[0.95, 0.55]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.2} />
      </mesh>
      {/* Suporte do monitor */}
      <mesh position={[0, 1, -0.28]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color="#1f1a17" roughness={0.5} />
      </mesh>

      {/* Prancheta com documentos */}
      <mesh position={[0.6, 0.95, 0]} rotation={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.02, 0.3]} />
        <meshStandardMaterial color="#fffaf4" roughness={0.9} />
      </mesh>

      {/* Caneca */}
      <mesh position={[-0.6, 0.9, 0.2]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  )
}

// Estação de Marketing - mural de campanhas
function CampaignWall({ color }: { color: string }) {
  return (
    <group>
      <BaseDesk color={color} />

      {/* Monitor principal */}
      <mesh position={[0, 1.25, -0.3]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.05]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.25, -0.27]}>
        <planeGeometry args={[0.85, 0.5]} />
        <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={0.15} />
      </mesh>

      {/* Tablet na mesa */}
      <mesh position={[0.5, 0.9, 0.1]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.02, 0.4]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Post-its coloridos */}
      {[
        { pos: [-0.6, 0.9, 0.2], color: '#FCD34D' },
        { pos: [-0.65, 0.9, 0.1], color: '#F87171' },
        { pos: [-0.55, 0.9, 0.15], color: '#34D399' }
      ].map((postit, i) => (
        <mesh key={i} position={postit.pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, 0.02, 0.15]} />
          <meshStandardMaterial color={postit.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// Estação Técnica - dev station com múltiplos monitores
function DevStation({ color }: { color: string }) {
  return (
    <group>
      <BaseDesk color={color} />

      {/* Monitor esquerdo */}
      <mesh position={[-0.35, 1.2, -0.3]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.05]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-0.35, 1.2, -0.27]}>
        <planeGeometry args={[0.45, 0.3]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.2} />
      </mesh>

      {/* Monitor central (maior) */}
      <mesh position={[0, 1.35, -0.3]} castShadow>
        <boxGeometry args={[0.7, 0.45, 0.05]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.35, -0.27]}>
        <planeGeometry args={[0.65, 0.4]} />
        <meshStandardMaterial color="#1e293b" emissive="#06B6D4" emissiveIntensity={0.1} />
      </mesh>

      {/* Monitor direito */}
      <mesh position={[0.4, 1.2, -0.3]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.05]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0.4, 1.2, -0.27]}>
        <planeGeometry args={[0.45, 0.3]} />
        <meshStandardMaterial color="#0f172a" emissive="#06B6D4" emissiveIntensity={0.15} />
      </mesh>

      {/* Teclado */}
      <mesh position={[0, 0.85, 0.15]} castShadow>
        <boxGeometry args={[0.5, 0.03, 0.18]} />
        <meshStandardMaterial color="#1f1a17" roughness={0.7} />
      </mesh>

      {/* Café */}
      <mesh position={[0.6, 0.9, 0.15]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.1, 16]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.3} />
      </mesh>
    </group>
  )
}

// Estação de CX - console de suporte
function SupportConsole({ color }: { color: string }) {
  return (
    <group>
      <BaseDesk color={color} />

      {/* Monitor principal com chat */}
      <mesh position={[0, 1.25, -0.3]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.05]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.25, -0.27]}>
        <planeGeometry args={[0.85, 0.5]} />
        <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={0.1} />
      </mesh>

      {/* Headset na mesa */}
      <mesh position={[-0.5, 0.88, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color="#1f1a17" roughness={0.5} />
      </mesh>
      <mesh position={[-0.55, 0.92, 0.05]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.08]} />
        <meshStandardMaterial color="#1f1a17" roughness={0.5} />
      </mesh>

      {/* Caixas de tickets */}
      {[
        { pos: [0.55, 0.85, -0.2], color: '#FCD34D' },
        { pos: [0.7, 0.85, 0], color: '#F87171' },
        { pos: [0.55, 0.85, 0.2], color: '#34D399' }
      ].map((box, i) => (
        <mesh key={i} position={box.pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.12]} />
          <meshStandardMaterial color={box.color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// Estação de Lojistas - dashboard merchant
function MerchantDashboard({ color }: { color: string }) {
  return (
    <group>
      <BaseDesk color={color} />

      {/* Monitor com gráficos */}
      <mesh position={[0, 1.3, -0.3]} castShadow>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.3, -0.27]}>
        <planeGeometry args={[0.95, 0.55]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.15} />
      </mesh>

      {/* Tablet com lista de lojistas */}
      <mesh position={[-0.6, 0.9, 0.1]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.25, 0.02, 0.35]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Caneca */}
      <mesh position={[0.55, 0.9, 0.2]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* Mini quadro de métricas */}
      <mesh position={[0.65, 0.85, -0.15]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.02]} />
        <meshStandardMaterial color="#fffaf4" roughness={0.9} />
      </mesh>
    </group>
  )
}

// Componente principal
export function Workstation({ type, position, color }: WorkstationProps) {
  const position3D: [number, number, number] = [position.x, position.y, position.z]

  const WorkstationComponent = useMemo(() => {
    switch (type) {
      case 'executive-desk':
        return ExecutiveDesk
      case 'campaign-wall':
        return CampaignWall
      case 'dev-station':
        return DevStation
      case 'support-console':
        return SupportConsole
      case 'merchant-dashboard':
        return MerchantDashboard
      default:
        return ExecutiveDesk
    }
  }, [type])

  return (
    <group position={position3D}>
      <WorkstationComponent color={color} />
    </group>
  )
}