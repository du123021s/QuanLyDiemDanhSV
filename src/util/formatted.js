export function getNumbers(string){
      const number = parseInt(string.match(/\d+/)[0],10);
      return number;
    }
    
export function getCharacters(string){
      const character = string.match(/[A-Za-z]+/g);
      return character;
}
    