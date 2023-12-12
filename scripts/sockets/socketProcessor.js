export default function(socket){
    return function(func){
        return function(...args){
            func(socket, ...args);
        }
    }
}