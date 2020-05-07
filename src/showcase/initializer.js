var stamp = '0-STAMP';
// Detect broken legacy edge
if (/Edge\/\d+./i.test(navigator.userAgent) || !('noModule' in HTMLScriptElement.prototype)) {
  System.import('./regenerator.js').then(function() {
    System.import('./bundle-es5.min/index.js?v=' + stamp);
  });
} else {
  var t = document.createElement('script');
  t.type = 'module';
  t.src = './bundle-es2015.min/index.js?v=' + stamp;
  document.body.appendChild(t);
}
