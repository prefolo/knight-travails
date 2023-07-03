import Board from './Board';
import { getStartCell, getCellByXY, getKnight, moveKnightToCell, enableButtons } from './dom';

const animatePath = (path, cellBgColor) => {
	if (Board.endCellNode == null) return;
	
	const cellSize = 48;
	const deltaTime = 300;
	let timeCount = 0;
	
	const animate = (timeCount, x, y, cell, i) => {
		setTimeout(() => {
			getKnight().style.transform = `translateY(${x}px) translateX(${y}px)`;
			setTimeout(() => {
				if (cell) {
					if( i != null && i != path.length - 2 ) cell.style.backgroundColor = cellBgColor;
					cell.textContent = i + 1;
				}}, deltaTime);
		}, timeCount);
	};

	for (let i = 0, totalX = 0, totalY = 0, deltaX, deltaY; i < path.length - 1; i++) {
		deltaY = path[i][0] > path[i + 1][0]
				? (path[i][0] - path[i + 1][0]) * cellSize
				: -Math.abs((path[i + 1][0] - path[i][0]) * cellSize);
		totalX += deltaY;
		animate(timeCount, totalX, totalY);
		timeCount += deltaTime;

		deltaX = path[i][1] > path[i + 1][1]
				? -Math.abs((path[i][1] - path[i + 1][1]) * cellSize)
				: (path[i + 1][1] - path[i][1]) * cellSize;
		totalY += deltaX;
		animate(timeCount, totalX, totalY, getCellByXY(path[i + 1][0], path[i + 1][1]), i);
		timeCount += deltaTime;
	}

	setTimeout(() => { moveKnightToCell(getStartCell()); enableButtons('travailBtn','selectEndBtn','placeBtn','randomBtn','clearBtn'); }, timeCount);
};

export default animatePath;
