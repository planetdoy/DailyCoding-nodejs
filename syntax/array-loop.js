var arr = [1, 2, 3, 4, 5, 10000];
var total = 0;

var i = 0;
while(i<arr.length){
  console.log(arr[i]);
  total = total + arr[i];
  i++;
}

console.log(`total = ${total}`);
