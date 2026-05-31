import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function RobloxCharacter({
  skinTone = '#FFDABB',
  hairColor = '#4A2800',
  hairStyle = 'short',
  clothesColor = '#4A90D9',
  hatStyle = 'none',
  isMoving = false,
}) {
  const armLRef = useRef()
  const armRRef = useRef()
  const legLRef = useRef()
  const legRRef = useRef()
  const bodyRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const swing = isMoving ? Math.sin(t * 7) * 0.5 : Math.sin(t * 1.5) * 0.04
    const bob = isMoving ? Math.abs(Math.sin(t * 7)) * 0.06 : Math.sin(t * 1.5) * 0.03
    if (armLRef.current) armLRef.current.rotation.x = isMoving ? swing : 0
    if (armRRef.current) armRRef.current.rotation.x = isMoving ? -swing : 0
    if (legLRef.current) legLRef.current.rotation.x = isMoving ? -swing : 0
    if (legRRef.current) legRRef.current.rotation.x = isMoving ? swing : 0
    if (bodyRef.current) bodyRef.current.position.y = bob
  })

  return (
    <group ref={bodyRef}>
      {/* HEAD */}
      <group position={[0, 1.78, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.82, 0.82, 0.82]} />
          <meshLambertMaterial color={skinTone} />
        </mesh>
        {/* Eyes */}
        {[[-0.19, 0.07, 0.42], [0.19, 0.07, 0.42]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.15, 0.18, 0.04]} />
            <meshLambertMaterial color="#222" />
          </mesh>
        ))}
        {/* Eye shine */}
        {[[-0.15, 0.12, 0.44], [0.23, 0.12, 0.44]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.05, 0.05, 0.02]} />
            <meshLambertMaterial color="white" />
          </mesh>
        ))}
        {/* Smile */}
        <mesh position={[0, -0.13, 0.42]}>
          <boxGeometry args={[0.3, 0.07, 0.04]} />
          <meshLambertMaterial color="#CC6677" />
        </mesh>
        {/* Cheeks */}
        {[[-0.3, -0.08, 0.42], [0.3, -0.08, 0.42]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.16, 0.1, 0.02]} />
            <meshLambertMaterial color="#FFB3BA" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* HAIR */}
      <group position={[0, 1.78, 0]}>
        {hairStyle === 'short' && (
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.86, 0.26, 0.86]} />
            <meshLambertMaterial color={hairColor} />
          </mesh>
        )}
        {hairStyle === 'long' && (<>
          <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.86, 0.26, 0.86]} /><meshLambertMaterial color={hairColor} /></mesh>
          <mesh position={[0, -0.08, -0.37]}><boxGeometry args={[0.82, 1.05, 0.2]} /><meshLambertMaterial color={hairColor} /></mesh>
          <mesh position={[-0.4, -0.06, -0.05]}><boxGeometry args={[0.14, 0.9, 0.42]} /><meshLambertMaterial color={hairColor} /></mesh>
          <mesh position={[0.4, -0.06, -0.05]}><boxGeometry args={[0.14, 0.9, 0.42]} /><meshLambertMaterial color={hairColor} /></mesh>
        </>)}
        {hairStyle === 'curly' && (
          [[-0.26,0.48,0.2],[0.26,0.48,0.2],[0,0.6,0],[0,0.47,-0.26],[-0.2,0.44,-0.2],[0.2,0.44,-0.2],[-0.38,0.4,0.1],[0.38,0.4,0.1]].map(([x,y,z],i) => (
            <mesh key={i} position={[x,y,z]}><boxGeometry args={[0.33,0.33,0.33]} /><meshLambertMaterial color={hairColor} /></mesh>
          ))
        )}
        {hairStyle === 'braids' && (<>
          <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.86, 0.26, 0.86]} /><meshLambertMaterial color={hairColor} /></mesh>
          <mesh position={[-0.28,-0.4,-0.08]}><boxGeometry args={[0.18,1.5,0.18]} /><meshLambertMaterial color={hairColor} /></mesh>
          <mesh position={[0.28,-0.4,-0.08]}><boxGeometry args={[0.18,1.5,0.18]} /><meshLambertMaterial color={hairColor} /></mesh>
        </>)}
        {hairStyle === 'ponytail' && (<>
          <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.86, 0.26, 0.86]} /><meshLambertMaterial color={hairColor} /></mesh>
          <mesh position={[0, 0.12, -0.52]}><boxGeometry args={[0.28, 0.85, 0.22]} /><meshLambertMaterial color={hairColor} /></mesh>
        </>)}
        {hairStyle === 'afro' && (
          [[0,0.64,0],[-0.34,0.48,0.1],[0.34,0.48,0.1],[0,0.48,-0.34],[0,0.48,0.34],[-0.24,0.64,-0.24],[0.24,0.64,-0.24],[-0.24,0.64,0.24],[0.24,0.64,0.24],[-0.4,0.36,0],[0.4,0.36,0]].map(([x,y,z],i) => (
            <mesh key={i} position={[x,y,z]}><boxGeometry args={[0.38,0.38,0.38]} /><meshLambertMaterial color={hairColor} /></mesh>
          ))
        )}
        {hairStyle === 'mohawk' && (
          <mesh position={[0, 0.7, 0]}><boxGeometry args={[0.22, 0.64, 0.82]} /><meshLambertMaterial color={hairColor} /></mesh>
        )}

        {/* HATS */}
        {hatStyle === 'cap' && (<>
          <mesh position={[0, 0.54, 0]}><boxGeometry args={[0.94, 0.22, 0.94]} /><meshLambertMaterial color="#E74C3C" /></mesh>
          <mesh position={[0, 0.5, 0.54]}><boxGeometry args={[0.74, 0.12, 0.32]} /><meshLambertMaterial color="#E74C3C" /></mesh>
        </>)}
        {hatStyle === 'crown' && (<>
          <mesh position={[0, 0.53, 0]}><boxGeometry args={[0.94, 0.18, 0.94]} /><meshLambertMaterial color="#FFD700" /></mesh>
          {[[-0.3,0.78],[0,0.85],[0.3,0.78]].map(([x,y],i) => (
            <mesh key={i} position={[x,y,0]}><boxGeometry args={[0.18,0.48,0.18]} /><meshLambertMaterial color="#FFD700" /></mesh>
          ))}
        </>)}
        {hatStyle === 'bow' && (<>
          {[[-0.24,0.57,0.32],[0.24,0.57,0.32]].map(([x,y,z],i) => (
            <mesh key={i} position={[x,y,z]}><boxGeometry args={[0.22,0.22,0.1]} /><meshLambertMaterial color="#FF69B4" /></mesh>
          ))}
          <mesh position={[0,0.57,0.32]}><boxGeometry args={[0.1,0.1,0.1]} /><meshLambertMaterial color="#FF1493" /></mesh>
        </>)}
      </group>

      {/* NECK */}
      <mesh position={[0, 1.34, 0]}>
        <boxGeometry args={[0.34, 0.22, 0.34]} />
        <meshLambertMaterial color={skinTone} />
      </mesh>

      {/* TORSO */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.92, 0.82, 0.52]} />
        <meshLambertMaterial color={clothesColor} />
      </mesh>
      <mesh position={[0, 0.95, 0.27]}>
        <boxGeometry args={[0.28, 0.28, 0.02]} />
        <meshLambertMaterial color="white" transparent opacity={0.35} />
      </mesh>

      {/* LEFT ARM */}
      <group ref={armLRef} position={[-0.66, 1.12, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.35, 0.76, 0.35]} />
          <meshLambertMaterial color={clothesColor} />
        </mesh>
        <mesh position={[0, -0.73, 0]}>
          <boxGeometry args={[0.32, 0.26, 0.32]} />
          <meshLambertMaterial color={skinTone} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={armRRef} position={[0.66, 1.12, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.35, 0.76, 0.35]} />
          <meshLambertMaterial color={clothesColor} />
        </mesh>
        <mesh position={[0, -0.73, 0]}>
          <boxGeometry args={[0.32, 0.26, 0.32]} />
          <meshLambertMaterial color={skinTone} />
        </mesh>
      </group>

      {/* BELT */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.94, 0.13, 0.54]} />
        <meshLambertMaterial color="#1a1a2e" />
      </mesh>

      {/* LEFT LEG */}
      <group ref={legLRef} position={[-0.24, 0.52, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <boxGeometry args={[0.38, 0.76, 0.42]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
        <mesh position={[0, -0.88, 0.06]}>
          <boxGeometry args={[0.42, 0.2, 0.52]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* RIGHT LEG */}
      <group ref={legRRef} position={[0.24, 0.52, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <boxGeometry args={[0.38, 0.76, 0.42]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
        <mesh position={[0, -0.88, 0.06]}>
          <boxGeometry args={[0.42, 0.2, 0.52]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  )
}
