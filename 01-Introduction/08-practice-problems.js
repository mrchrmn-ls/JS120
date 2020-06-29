function createBook(title, author, read = false) {
  return {
    title, 
    author,
    read,

    readBook() {
      this.read = true;
    },

    getDescription() {
      return `${this.title} was written by ${this.author}. ` + 
             `I ${this.read ? "have" : "haven't"} read it.`;
    }
  };
}

let book1 = createBook("Mythos", "Stephen Fry");
let book2 = createBook("Me Talk Pretty One Day", "David Sedaris");
let book3 = createBook("Aunts aren't Gentlemen", "PG Woodhouse");

console.log(book1);
console.log(book2.getDescription());
book2.readBook();
console.log(book2.getDescription());
console.log(book2);
