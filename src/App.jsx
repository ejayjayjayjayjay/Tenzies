import { useState, useRef, useEffect } from 'react'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import './App.css'
import Die from './components/Die'

function App() {
  const [dice, setDice] = useState(() => generateAllNewDice())
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const buttonRef = useRef(null)

  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)

  useEffect(() => {
    if (isRunning && !gameWon) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1)
      }, 1000)
    }

    return () => clearInterval(intervalRef.current) // Cleanup on unmount
  }, [isRunning, gameWon])

  useEffect(() => {
    if (gameWon) {
      clearInterval(intervalRef.current) // Stop timer
      buttonRef.current.focus()
    }
  }, [gameWon])

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }))
  }

  function rollDice() {
    if (!gameWon) {
      setDice(prevDice => prevDice.map(die => (
        die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
      )))
    } else {
      setDice(generateAllNewDice())
      setTimeElapsed(0) // Reset timer
      setIsRunning(false) // Reset game state
    }
  }

  function hold(id) {
    if (!isRunning) setIsRunning(true) // Start timer on first click

    setDice(prevDice => prevDice.map(die => 
      die.id === id ? { ...die, isHeld: !die.isHeld } : die
    ))
  }

  const diceElements = dice.map(die => (
    <Die key={die.id} value={die.value} isHeld={die.isHeld} hold={() => hold(die.id)} />
  ))

  return (
    <>
      <main>
        {gameWon && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="time-elapsed">Time Elapsed: {timeElapsed} seconds</p>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
        </p>
        <div className="dice-container">
          {diceElements}
        </div>
        {!gameWon ? (
          <button className="roll-dice" onClick={rollDice}>Roll</button>
        ) : (
          <button ref={buttonRef} className="roll-dice" onClick={rollDice}>New Game</button>
        )}
      </main>
    </>
  )
}

export default App
