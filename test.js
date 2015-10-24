var path = require('path');
var assert = require('assert');
var concatStream = require('concat-stream');
var gulp = require('gulp');
var changedInPlace = require('./');

describe('gulp-changed-in-place', function () {
  it('passes all files on start by default', function (done) {
    gulp.src('fixture/*')
      .pipe(changedInPlace({ firstPass: true, cache: {} }))
      .pipe(concatStream(function (buf) {
        assert.equal(2, buf.length);
        assert.equal('a', path.basename(buf[0].path));
        assert.equal('b', path.basename(buf[1].path));
        done();
      }));
  });

  it('does not pass all files on start with `firstPass: false`', function (done) {
    gulp.src('fixture/*')
      .pipe(changedInPlace({ firstPass: false, cache: {} }))
      .pipe(concatStream(function (buf) {
        assert.equal(0, buf.length);
        done();
      }));
  });

  it('should only pass through files when they change', function (done) {
    var shas = {};

    shas[path.join(__dirname, 'fixture/a')] = 'not matching sha';
    shas[path.join(__dirname, 'fixture/b')] = 'e9d71f5ee7c92d6dc9e92ffdad17b8bd49418f98';

    gulp.src('fixture/*')
      .pipe(changedInPlace({ firstPass: false, cache: shas }))
      .pipe(concatStream(function (buf) {
        assert.equal(1, buf.length);
        assert.equal('a', path.basename(buf[0].path));
        done();
      }));
  });
});
