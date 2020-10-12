/**
 * index.ts
 * 
 * sobird<i@sobird.me> at 2019-11-08 15:11:12 build.
 */
interface Person {
  firstName: string;
  lastName: string;
}

import './index.js';

class Test {
  
}


function greeter(person: Person) {
  return "Hello, " + person.firstName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter(user);