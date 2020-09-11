class CircularQueue {
  constructor(size) {
    this.buffer = new Array(size).fill(null);
    this.order = [];
  }

  enqueue(obj) {
    if (this.order.length === 0) {
      this.buffer[0] = obj;
      this.order.push(0);
    } else {
      let next = (this.order[this.order.length - 1] + 1) % this.buffer.length;
      if (!this.buffer.includes(null)) this.dequeue();
      this.buffer[next] = obj;
      this.order.push(next);
    }
  }

  dequeue() {
    if (this.order.length === 0) {
      return null;
    } else {
      let value = this.buffer[this.order[0]];
      this.buffer[this.order.shift()] = null;
      return value;
    }
  }

}

let queue = new CircularQueue(3);
console.log(queue.dequeue() === null);

queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue() === 1);

queue.enqueue(3);
queue.enqueue(4);
console.log(queue.dequeue() === 2);

queue.enqueue(5);
queue.enqueue(6);
queue.enqueue(7);
console.log(queue.dequeue() === 5);
console.log(queue.dequeue() === 6);
console.log(queue.dequeue() === 7);
console.log(queue.dequeue() === null);

let anotherQueue = new CircularQueue(4);
console.log(anotherQueue.dequeue() === null);

anotherQueue.enqueue(1);
anotherQueue.enqueue(2);
console.log(anotherQueue.dequeue() === 1);

anotherQueue.enqueue(3);
anotherQueue.enqueue(4);
console.log(anotherQueue.dequeue() === 2);

anotherQueue.enqueue(5);
anotherQueue.enqueue(6);
anotherQueue.enqueue(7);
console.log(anotherQueue.dequeue() === 4);
console.log(anotherQueue.dequeue() === 5);
console.log(anotherQueue.dequeue() === 6);
console.log(anotherQueue.dequeue() === 7);
console.log(anotherQueue.dequeue() === null);