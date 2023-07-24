type IsDay = boolean;
type Clock = THREE.Clock;
type Canvas = HTMLDivElement | null;
type CanvasSize = number;
type Mouse = THREE.Vector2;

type Time = {
    value: number
};

type ChartData = {
    name: string;
    value: number;
}

type LensflareConfig = [
    path: string,
    size: number,
    distance: number,
    color: number
]

type ChartDataArr = ChartData[];

type BarType = ('rect' | 'cylinder');

export {
    IsDay,
    Time,
    Clock,
    Canvas,
    CanvasSize,
    Mouse,
    ChartData,
    LensflareConfig,
    BarType,
    ChartDataArr
};
