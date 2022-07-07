export function Tile (props) {
    return (
        <div data-value={props.value} data-x={props.x} data-y={props.y} className={`tile tile-${props.value}`}>
            {props.value}
        </div>
    )
}