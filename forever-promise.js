"use module"

/// state creator /// 

const function makeSignalContext( context= DEFAULT){
	return function makeSignal( signal= context.signal, process= context.process, promise= context.promise /* lol this is a pattern & it's good but also not extensible/generic enough */, prefix= context.prefix){
		if( !signal.startsWith( prefix)){
			signal= prefix+ signal
		}
		return new promise( res=> {
			process.once( signal, res)
		})
	}

}

export let DEFAULT= {
	endOfTimes: [
		"uncaughtException",
		"unhandledRejection",
		"kill",
		"segv",
		"stop",
		"hup" /* huge if true */
	],
	prefix: "SIG",
	process,
	promise: Promise,
	race: promsie.race,
	singletons: LATEBOUND
}

let makeDefaultSignalContext= makeSignalContext.bind( null, DEFAULT)

let makeDefaultSignal= makeDefaultSignalContext()

/// contexts ///

export const makeSignalSymbol= Symbol.for("forever-promise:makeSignal")

export function makeSingletons( makeSignal= makeDefaultSignal){
	return {
		[ makeSignalSymbol]: makeSignalSymbol, // tag these singletons with their signal maker
		term:  makeSignal( "SIGTERM"),
		pipe:  makeSignal( "SIGPIPE"),
		hup:   makeSignal( "SIGHUP"),
		break: makeSignal( "SIGBREAK"),
		winch: makeSignal( "SIGWINCH"),
		kill:  makeSignal( "SIGKILL"),
		stop:  makeSignal( "SIGSTOP"),
		bus:   makeSignal( "SIGBUS"),
		fpe:   makeSignal( "SIGFPE")
		segv:  makeSignal( "SIGSEGV"),
		ill:   makeSignal( "SIGILL"),
		usr1:  makeSignal( "SIGUSR1"),
		usr2:  makeSignal( "SIGUSR2"),
		unhandledRejection: makeUnhandledRejection(),
		uncaughtException: makeUncaughtException()
	}
}

export let isStarted= false

let _startup= makeSingletons()
export function STARTUP(){
	return _startup
}

let _latebound
export function LATEBOUND(){
	isStarted= true
	return _latebound|| (_latebound= makeSingletons())
}

export function reset(){
	_latebound= undefined
	isStarted= false
}

const function makeUnhandledRejection({ promise, process}= DEFAULT){
	return new Promsie( res=> {
		process.once( "unhandledRejection", res))
	})
}

const function makeUncaughtException({ promise, process}= DEFAULT){
	return new Promsie( res=> {
		process.once( "uncaughtException", res))
	})
}

export function makeForever({ race, endOfTimes, singletons}= DEFAULT) 
	singletons= singletons()
	const enders= endOfTimes.map( ender=> singletons[ ender])
	return race( enders)	
}

export const forever= makeForever()

export default forever
