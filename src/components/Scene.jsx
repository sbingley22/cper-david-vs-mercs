/* eslint-disable react/no-unknown-property */
import { useAnimations, useGLTF } from "@react-three/drei"
import gltfFile from "../assets/martinezVsMercs.glb?url"
import { useEffect, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from 'three'


const Scene = ({ sandevistan, setSandevistan }) => {
  const { scene, nodes, animations } = useGLTF(gltfFile)
  const { actions, mixer } = useAnimations(animations, scene)

  const [dAnim, setDAnim] = useState("StartD")
  const [m1Anim, setM1Anim] = useState("StartM1")
  const [m2Anim, setM2Anim] = useState("StartM2")
  const [m3Anim, setM3Anim] = useState("StartM3")

  const hitTimer = useRef(0)
  const activeMerc = useRef(0)
  const deadMercs = useRef([])

  const chooseMerc = () => {
    if (deadMercs.current.length >= 3) return
    activeMerc.current += 1
    if (activeMerc.current > 3) activeMerc.current = 1

    if (deadMercs.current.includes(activeMerc.current)) {
      chooseMerc()
    }
  }

  useFrame((state, delta) => {
    if (dAnim == "IdleD") {
      if (Math.random() < delta/2) {
        chooseMerc()
        if (activeMerc.current == 1) {
          setDAnim("AimAtM1")
          setM1Anim("AimM1")
        } else if (activeMerc.current == 2) {
          setDAnim("AimAtM2")
          setM2Anim("AimM2")
        } else if (activeMerc.current == 3) {
          setDAnim("AimAtM3")
          setM3Anim("AimM3")
        }

        hitTimer.current = 2
      }
    }

    if (hitTimer.current > 0) {
      hitTimer.current -= delta
      if (hitTimer.current < 0) hitTimer.current = 0

      const mercMaterial = nodes["merc"+activeMerc.current].material
      const colorChange = hitTimer.current * 6
      mercMaterial.color.b = 1 - colorChange
      mercMaterial.color.g = 1 - colorChange
    }
  })

  // Initial setup
 useEffect(()=>{
   Object.keys(nodes).forEach(nodeKey => {
     const node = nodes[nodeKey]
     if (node.type == "SkinnedMesh") {
       node.castShadow = true
       node.frustumCulled = false
     }
   })
   console.log(nodes)
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [nodes])

  // David Animations
  useEffect(()=>{
    actions[dAnim].reset().fadeIn(0.5).play()

    return () => actions[dAnim].fadeOut(0.5)
  },[actions, dAnim])

  // M1 Animations
  useEffect(()=>{
    actions[m1Anim].reset().fadeIn(0.5).play()

    return () => actions[m1Anim].fadeOut(0.5)
  },[actions, m1Anim])

  // M2 Animations
  useEffect(()=>{
    actions[m2Anim].reset().fadeIn(0.5).play()

    return () => actions[m2Anim].fadeOut(0.5)
  },[actions, m2Anim])

  // M3 Animations
  useEffect(()=>{
    actions[m3Anim].reset().fadeIn(0.5).play()

    return () => actions[m3Anim].fadeOut(0.5)
  },[actions, m3Anim])

  // Mixer
  useEffect(()=>{
    const singleAnims = ['StartD', 'StartM1', 'StartM2', 'StartM3', 'AimAtM1', 'AimAtM2', 'AimAtM3', 'AimM1', 'AimM2', 'AimM3', 'DamageFromM1', 'DamageFromM2', 'DamageFromM3']
    singleAnims.forEach( a => {
      actions[a].repetitions = 1
      actions[a].clampWhenFinished = true
    })

    mixer.addEventListener('finished', () => {
      if (dAnim== 'StartD') setDAnim('IdleD')
      else if (dAnim== 'AimAtM1') setDAnim('DamageFromM1')
      else if (dAnim== 'AimAtM2') setDAnim('DamageFromM2')
      else if (dAnim== 'AimAtM3') setDAnim('DamageFromM3')
      else if (dAnim== 'DamageFromM1') setDAnim('IdleD')
      else if (dAnim== 'DamageFromM2') setDAnim('IdleD')
      else if (dAnim== 'DamageFromM3') setDAnim('IdleD')
      if (m1Anim== 'StartM1') setM1Anim('IdleM1')
      else if (m1Anim== 'AimM1') setM1Anim('AttackM1')
      else if (m1Anim== 'AttackM1') setM1Anim('IdleM1')
      else if (m1Anim== 'DamageM1') setM1Anim('IdleM1')
      if (m2Anim== 'StartM2') setM2Anim('IdleM2')
      else if (m2Anim== 'AimM2') setM2Anim('AttackM2')
      else if (m2Anim== 'AttackM2') setM2Anim('IdleM2')
      else if (m2Anim== 'DamageM2') setM2Anim('IdleM2')
      if (m3Anim== 'StartM3') setM3Anim('IdleM3')
      else if (m3Anim== 'AimM3') setM3Anim('AttackM3')
      else if (m3Anim== 'AttackM3') setM3Anim('IdleM3')
      else if (m3Anim== 'DamageM3') setM3Anim('IdleM3')
    })

    return () => {
      mixer.removeEventListener('finished')
    }

  }, [actions, mixer, dAnim, m1Anim, m2Anim, m3Anim])

  const raycaster = new THREE.Raycaster(); // Create a new Raycaster instance

  const { camera } = useThree()
  const handleClick = (e) => {
    // Get mouse position
    const mouse = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };

    // Set raycaster properties
    raycaster.setFromCamera(mouse, camera); // Replace `camera` with your camera reference

    // Perform raycasting
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Check for intersections
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      console.log('Clicked Object:', clickedObject.name);
      // Do something with the clicked object
    }
  };

  return (
    <>
      <primitive 
        object={scene}
        dispose={null}
        onClick={handleClick}
      />
    </>
  )
}

export default Scene

useGLTF.preload(gltfFile)