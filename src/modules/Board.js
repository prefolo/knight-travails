const Node = ([x, y]) => {
	return { coords: [x, y], id: `${x},${y}`, prevNode: null };
};

const Board = {
	startCellNode: null,
	endCellNode: null,
	
	setStartCellNode(DOMcell) {
		this.startCellNode = Node([parseInt(DOMcell.dataset.x), parseInt(DOMcell.dataset.y)]);
	},

	setEndCellNode(DOMcell) {
		this.endCellNode = Node([parseInt(DOMcell.dataset.x), parseInt(DOMcell.dataset.y)]);
	},

	render() {
		const container = document.querySelector('#board');
		
		for (let i = 0; i < 8; i++) {
			let row = document.createElement('div');
			
			for (let y = 0; y < 8; y++) {
				let cell = document.createElement('div');
				
				if (i % 2 === 0)
					y % 2 === 0 ? cell.classList.add('brightColor') : cell.classList.add('darkColor');
				else
					y % 2 === 0 ? cell.classList.add('darkColor') : cell.classList.add('brightColor');
		
				cell.classList.add('cell');
				cell.dataset.x = i;
				cell.dataset.y = y;
		
				row.appendChild(cell);
			}
			
			container.appendChild(row);
		}
	},

	getPossibleMoves([x, y]) {
		const possibleMoves = [];
		const moveX = [2, 1, -1, -2, -2, -1, 1, 2];
		const moveY = [1, 2, 2, 1, -1, -2, -2, -1];

		for (let i = 0, newX, newY; i < 8; i++) {
		  newX = x + moveX[i];
		  newY = y + moveY[i];
		  
		  if (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7)
			possibleMoves.push([newX, newY]);
		}
		return possibleMoves;
	  },

	  getShortestPath(){
			// queue in cui vengono inseriti i nodi figli del
			// nodo corrente che non sono stati ancora visitati
			const queue = [ this.startCellNode ];

			// qui vengono inseriti i nodi già visitati
			const visitedNodes = [];
			
			return bfs(this.startCellNode, this.endCellNode);

			function bfs(currentNode, endNode) {
			  // rimuove un nodo dalla coda
			  // lo pone nell'array visitedNodes
			  visitedNodes.push(queue.shift());

			  // possibleMoves contiene un array di posizioni possibili
			  let possibleMoves = Board.getPossibleMoves(currentNode.coords);
			  let adjacentNode;
			  
			  // 1. Crea i nodi figlio del nodo corrente, con value la loro posizione
			  // e prev che punta al nodo corrente
			  // 2. se non sono stati ancora visitati li pone nella coda
			  possibleMoves.forEach((possibleMove) => {
				  adjacentNode = Node(possibleMove);
				  adjacentNode.prevNode = currentNode;
				  
				  if (!visitedNodes.some((visitedNode) => visitedNode.id === adjacentNode.id)) {
					  queue.push(adjacentNode); // lo inserisce nella coda
				  }
			  });

			  // caso base della ricorsione
			  // se il nodo corrente è il nodo finale
			  if (currentNode.id === endNode.id) {
				  return currentNode; // lo ritorna
			  } else {
				  // altrimenti fa una chiamata ricorsiva a bfs
				  // con il primo parametro il nodo sul fronte della coda
				  return bfs(queue[0], endNode);
			  }
		  }
	  },

	  getShortestPathCoords() {
		let path = this.getShortestPath();
		
		const shortestPathCoords = [];
		shortestPathCoords.push(path.coords);
		
		while (path.prevNode !== null) {
		  shortestPathCoords.unshift(path.prevNode.coords);
		  path = path.prevNode;
		}
		
 		return shortestPathCoords;
	  },
	
	reset() {
		this.startCellNode = null;
		this.endCellNode = null;
	},
	resetEndCell() {
		this.endCellNode = null;
	}
};

export default Board;
