var { context, test } = require( '@jhermsmeier/control' )
var assert = require( 'assert' )
var fs = require( 'fs' )
var path = require( 'path' )
var crc32 = require( '..' )

var dataFile = path.join( __dirname, 'data', 'random.bin' )
var data = fs.readFileSync( dataFile )

context( 'crc32', function() {

  test( 'crc32()', function() {
    var checksum = crc32( data )
    assert.equal( checksum.toString(16), '4c429bb2' )
  })

  test( 'crc32.createHash()', function( done ) {
    fs.createReadStream( dataFile )
      .pipe( crc32.createHash() )
      .on( 'error', done )
      .on( 'end', done )
      .on( 'readable', function() {
        while( checksum = this.read() ) {
          assert.equal( this.bytesRead, 1024 * 1024 )
          assert.deepEqual( checksum, Buffer.from( '4c429bb2', 'hex' ) )
        }
      })
  })

  test( 'crc32.Hash#update()', function() {
    var hash = crc32.createHash()
      .update( data.slice( 0, 1024 * 1024 * 0.5 ) )
      .update( data.slice( 1024 * 1024 * 0.5 ) )
    assert.equal( hash.bytesRead, 1024 * 1024 )
    assert.equal( hash.digest( 'hex' ), '4c429bb2' )
  })

  test( 'crc32.Hash()', function( done ) {
    fs.createReadStream( dataFile )
      .pipe( new crc32.Hash() )
      .on( 'error', done )
      .on( 'end', done )
      .on( 'readable', function() {
        while( checksum = this.read() ) {
          assert.equal( this.bytesRead, 1024 * 1024 )
          assert.deepEqual( checksum, Buffer.from( '4c429bb2', 'hex' ) )
        }
      })
  })

  test( 'crc32.Hash({ encoding: "hex" })', function( done ) {
    fs.createReadStream( dataFile )
      .pipe( new crc32.Hash({ encoding: 'hex' }) )
      .on( 'error', done )
      .on( 'end', done )
      .on( 'readable', function() {
        while( checksum = this.read() ) {
          assert.equal( this.bytesRead, 1024 * 1024 )
          assert.equal( checksum, '4c429bb2' )
        }
      })
  })

})
