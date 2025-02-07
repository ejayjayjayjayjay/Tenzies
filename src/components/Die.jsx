export default function Die(props) {
    const style = {
        backgroundColor: props.isHeld ? '#59E391' : '#FFFF'
    }
    return (
        <button 
            onClick={props.hold} 
            style={style}
            aria-pressed={props.isHeld}
            aria-label={`Die showing ${props.value}. Click to ${props.isHeld ? 'unhold' : 'hold'}`}
        >{props.value}</button>
    )
}