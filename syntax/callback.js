function a(){

  console.log('a');
}

a();


var b = function (){
  console.log('b');
}

b();

function slowfunc(callback){
  callback();
}

slowfunc(b);
