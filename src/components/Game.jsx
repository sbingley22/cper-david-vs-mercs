/* eslint-disable react/no-unknown-property */
import { Center, Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Scene from "./Scene"
import ShadowCatcher from "./ShadowCatcher"
import { useState } from "react"


const Game = () => {
  const [sandevistan, setSandevistan] = useState(0.0)
  return (
    <>
      <Canvas shadows camera={{position: [-2,1,-4]}}>
        <OrbitControls />

        <Environment preset="night" environmentIntensity={0.9} />
        <directionalLight position={[0,5,0]} castShadow/>

        <Center position={[0,-.4,-1]}>
          <Scene sandevistan={sandevistan} setSandevistan={setSandevistan} />
          <ShadowCatcher position-z={2} />
        </Center>
      </Canvas>
      <div className="hud">
        <p>SANDEVISTAN: {sandevistan}</p>
      </div>
    </>
  )
}

export default Game
