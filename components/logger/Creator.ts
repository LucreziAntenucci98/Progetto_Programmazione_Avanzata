import {LogMsg} from "./LogMsg";
/**
 * The Creator class declares the factory method that is supposed to return an
 * object of a LogMsg class. The Creator's subclasses usually provide the
 * implementation of this method.
 */
 export abstract class Creator {
    /**
     * Note that the Creator may also provide some default implementation of the
     * factory method.
     */
    public abstract factoryMethod(): LogMsg;

    /**
     * Also note that, despite its name, the Creator's primary responsibility is
     * not creating products. Usually, it contains some core business logic that
     * relies on LogMsg objects, returned by the factory method. Subclasses can
     * indirectly change that business logic by overriding the factory method
     * and returning a different type of logger from it.
     */
    public writeMsg(msg:string): void {
        // Call the factory method to create a LogMsg object.
        const logger = this.factoryMethod();
        // Now, use the logger.
        logger.printMsg(msg) 
    }
}





/**
 * The client code works with an instance of a concrete creator, albeit through
 * its base interface. As long as the client keeps working with the creator via
 * the base interface, you can pass it any creator's subclass.
 */
/*
function clientCode(creator: Creator) {
    // ...
    console.log('Client: I\'m not aware of the creator\'s class, but it still works.');
    console.log(creator.writeMsg());
    // ...
}
*/
/**
 * The Application picks a creator's type depending on the configuration or
 * environment.
 */
/*
console.log('App: Launched with the LogError.');
clientCode(new LogError());
console.log('');

console.log('App: Launched with the LogInfo.');
clientCode(new LogInfo());

*/