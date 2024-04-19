/* eslint-disable react/no-unknown-property */
import { Center, Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Scene from "./Scene"
import ShadowCatcher from "./ShadowCatcher"
import { useEffect, useRef, useState } from "react"
import { EffectComposer, Glitch, Noise, Vignette } from "@react-three/postprocessing"


const Game = () => {
  const [sandevistan, setSandevistan] = useState(0.0)
  const [glitchActive, setGlitchActive] = useState(false)
  const [reset, setReset] = useState(false)
  const songRef = useRef(null)

  const handleClick = () => {
    songRef.current.play()
  }

  useEffect(()=>{
    if (glitchActive) {
      setTimeout(()=>{
        setGlitchActive(false)
      }, 1000)
    }
  }, [glitchActive])

  return (
    <>
      <Canvas shadows camera={{position: [-2,1,-4]}} onClick={handleClick}>
        <OrbitControls />

        <Environment preset="night" environmentIntensity={0.9} />
        <directionalLight position={[0,5,0]} castShadow/>

        <Center position={[0,-.4,-1]}>
          <Scene reset={reset} sandevistan={sandevistan} setSandevistan={setSandevistan} setGlitchActive={setGlitchActive} />
          <ShadowCatcher position-z={2} />
        </Center>

        <EffectComposer>
          <Vignette eskil={false} offset={0.21} darkness={1.1} />
          <Noise opacity={glitchActive ? 0.5: 0} />
          <Glitch
            delay={[0.1, 0.3]}
            duration={[0.8, 1.0]}
            strength={[0.04, 0.08]}
            active={glitchActive}
            ratio={0.85}
          />
        </EffectComposer>
      </Canvas>
      <div className="hud">
        <button onClick={()=>setReset(prev=>!prev)}>RESET</button>
        <h1 style={{color: sandevistan < 1 ? 'red' : '#BBFFBB', fontSize: "larger"}}>SANDEVISTAN: {(sandevistan*100).toFixed(0)}</h1>
      </div>
      <audio ref={songRef} controls={false} loop>
        <source src="./yourHouse.m4a" type="audio/mp4" />
      </audio>
    </>
  )
}

export default Game
