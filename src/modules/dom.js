import knightSVG from '../knight.svg';
import Board from './Board';
import animatePath from './animation';





//-- Getters

export const getStartCell = (_bgColor) => {
	if( !Board.startCellNode ) return;

	return getCellByXY(...Board.startCellNode.coords, _bgColor);
}; 

export const getCellByXY = (x, y, _bgColor) => {
	const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
	if(_bgColor) cell.style.backgroundColor = _bgColor;

	return cell;
};

const getCells = () => {
	return document.querySelectorAll('.cell');
}; 

export const getKnight = () => {
	return document.querySelector('#knight');
};




//-- DOM

const newKnightImg = () => {
	let knight = new Image();
	knight.src = knightSVG;
	knight.id = 'knight';
	return knight;
};

export const moveKnightToCell = cell => {
	const knight = getKnight();
	knight.parentNode.removeChild(knight);
	cell.appendChild(newKnightImg());
};





//-- Events


// Utils

const showTip = (innerHTML) => {
	const el = document.querySelector('#tip');

	el.innerHTML = innerHTML;
	el.style.visibility = "visible";
	el.classList.add('blink');
}
const hideTip = () => {
	const el = document.querySelector('#tip');
	el.classList.remove('blink');
	el.style.visibility = "hidden";
}

export const enableButtons = (...ids) => {
	ids.forEach( (id) => { document.querySelector('#'+id).disabled = false; } );
} 

const disableButtons = (...ids) => {
	ids.forEach( (id) => { document.querySelector('#'+id).disabled = true; } );
}

const addEventListenerToCells = (eventHandler) => {
	getCells().forEach(cell => {
		cell.addEventListener('click', eventHandler);
	});
}

const removeEventListenerFromCells = (eventHandler) => {
	getCells().forEach(cell => {
		cell.removeEventListener('click', eventHandler);
	});
}

// ------





const COLOR_DARK 	= '#73362D';
const COLOR_BRIGHT 	= '#F0E0CA';
const COLOR_START 	= 'yellow';
const COLOR_PATH 	= 'orange';
const COLOR_END 	= '#ff2a00';



const clearBoard = (keepKnightStartPosition) => {
	if(keepKnightStartPosition != 1) keepKnightStartPosition = 0;
	
	keepKnightStartPosition ?  Board.resetEndCell() : Board.reset();
	
	getCells().forEach(cell => {
		cell.innerHTML = '';
		cell.style.backgroundColor = cell.classList.contains('brightColor') ? COLOR_BRIGHT : COLOR_DARK;
	});

	hideTip();
	disableButtons('selectEndBtn','travailBtn');

	if(keepKnightStartPosition)
		getStartCell(COLOR_START).appendChild(newKnightImg());
};



const placement_manual = () => {
	clearBoard();
	showTip('Click a cell on the board to place the knight<br>⌄');
	
	addEventListenerToCells(placement_manual_cellsEventHandler);
};

const placement_manual_cellsEventHandler = e => {
	const startCell = getCellByXY(e.target.dataset.x, e.target.dataset.y, COLOR_START);
	startCell.appendChild(newKnightImg());
	
	Board.setStartCellNode(startCell);
	hideTip();
	enableButtons('selectEndBtn');
	
	removeEventListenerFromCells( placement_manual_cellsEventHandler );
};


const placement_random = () => {
	clearBoard();
	
	removeEventListenerFromCells( placement_manual_cellsEventHandler );

	const randomCell = getCellByXY(Math.floor(Math.random() * 8),  Math.floor(Math.random() * 8), COLOR_START);
	randomCell.appendChild(newKnightImg());
	
	Board.setStartCellNode(randomCell);
	enableButtons('selectEndBtn');
};



const selectEndCell = () => {
	clearBoard(1);

	showTip('Click a cell on the board to set the destination<br>⌄');
	disableButtons('clearBtn');

	addEventListenerToCells(selectEndCell_cellsEventHandler);
};

const selectEndCell_cellsEventHandler = e => {
	Board.setEndCellNode(e.target);
	
	getCellByXY(e.target.dataset.x, e.target.dataset.y, COLOR_END);

	hideTip();
	enableButtons('selectEndBtn','travailBtn','clearBtn');

	removeEventListenerFromCells( selectEndCell_cellsEventHandler );
};



const knightTravails = () => {
	disableButtons('placeBtn','randomBtn','travailBtn','selectEndBtn','clearBtn');
	animatePath(Board.getShortestPathCoords(), COLOR_PATH);
};





export const setupUI = () => {
	Board.render();
	clearBoard();
	
	document.querySelector('#clearBtn').addEventListener('click', clearBoard);
	document.querySelector('#placeBtn').addEventListener('click', placement_manual);
	document.querySelector('#randomBtn').addEventListener('click', placement_random);
	document.querySelector('#selectEndBtn').addEventListener('click', selectEndCell);
	document.querySelector('#travailBtn').addEventListener('click', knightTravails);
};