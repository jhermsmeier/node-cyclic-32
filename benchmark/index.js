var crypto = require( 'crypto' )
var fs = require( 'fs' )
var bench = require( 'nanobench' )
var crc32 = require( '..' )

const ITERATIONS = 1000

bench( `crc32( 1MB ) ⨉ ${ITERATIONS}`, function( run ) {

  var buffer = crypto.randomBytes(1 * 1024 * 1024)

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    checksum = crc32( buffer )
  }
  run.end()

})

bench( `crc32c( 1MB ) ⨉ ${ITERATIONS}`, function( run ) {

  var buffer = crypto.randomBytes(1 * 1024 * 1024)

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    checksum = crc32( buffer, 0, crc32.TABLE.CASTAGNOLI )
  }
  run.end()

})

;[
  { name: 'crc32', fn: require('crc32') },
  { name: 'buffer-crc32', fn: require('buffer-crc32') },
  { name: 'crc-32', fn: require('crc-32').buf },
  { name: 'polycrc', fn: require('polycrc').crc32 },
  { name: 'sse4_crc32', fn: require('sse4_crc32').calculate },
].forEach( function( lib ) {
  bench( `extern:${lib.name}( 1MB ) ⨉ ${ITERATIONS}`, function( run ) {
    var buffer = crypto.randomBytes(1 * 1024 * 1024)
    run.start()
    for( var i = 0; i < ITERATIONS; i++ ) {
      checksum = lib.fn( buffer )
    }
    run.end()
  })
})

bench( `crc32( 1MB ) ⨉ ${ITERATIONS}`, function( run ) {

  var buffer = crypto.randomBytes(1 * 1024 * 1024)

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    checksum = crc32( buffer )
  }
  run.end()

})

bench( `crc32.Hash() [1000MB] ⨉ ${1}`, function( run ) {

  var checksum = new crc32.Hash()
  var readStream = fs.createReadStream( '/dev/urandom', {
    end: 1000 * 1024 * 1024,
  })

  run.start()

  readStream.pipe( checksum )
    .on( 'end', function() {
      run.end()
    })
    .resume()

})
