var crypto = require( 'crypto' )
var fs = require( 'fs' )
var bench = require( 'nanobench' )
var crc32 = require( '..' )

const ITERATIONS = 100000

bench( `crc32( 512B ) ⨉ ${ITERATIONS}`, function( run ) {

  var buffer = crypto.randomBytes(512)

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    checksum = crc32( buffer )
  }
  run.end()

})

// ;[
//   { name: 'crc32', fn: require('crc32') },
//   { name: 'buffer-crc32', fn: require('buffer-crc32') },
//   { name: 'crc-32', fn: require('crc-32').buf },
//   { name: 'sse4_crc32', fn: require('sse4_crc32').calculate },
// ].forEach( function( lib ) {
//   bench( `${lib.name}( 512B ) ⨉ ${ITERATIONS}`, function( run ) {
//     var buffer = crypto.randomBytes(512)
//     run.start()
//     for( var i = 0; i < ITERATIONS; i++ ) {
//       checksum = lib.fn( buffer )
//     }
//     run.end()
//   })
// })

bench( `crc32( 1MB ) ⨉ ${1}`, function( run ) {

  var buffer = crypto.randomBytes(1024 * 1024)

  run.start()
  for( var i = 0; i < 1; i++ ) {
    checksum = crc32( buffer )
  }
  run.end()

})

bench( `crc32.Hash() [1MB] ⨉ ${1}`, function( run ) {

  var readStream = fs.createReadStream( __dirname + '/../test/data/random.bin' )
  var checksum = new crc32.Hash()

  readStream.pipe( checksum )
    .on( 'readable', function() {
      run.end()
    })

  run.start()

})
