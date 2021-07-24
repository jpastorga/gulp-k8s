var gulp = require('gulp');
var git = require('gulp-git');
var shell = require('gulp-shell');

// Clone a remote repo
gulp.task('clone', function(){
   return git.clone('https://github.com/jpastorga/docker-image-source.git', function (err) {
     if (err) throw err;
   });
});

// Update codebase
gulp.task('pull', function(){
  return git.pull('origin', 'master', {cwd: './docker-image-source'}, function (err) {
    if (err) throw err;
  });
});

//Build Docker Image
gulp.task('docker-build', shell.task([
  'docker build -t astorga/node-gulp:latest ./docker-image-source/container-info/',
  'docker push astorga/node-gulp:latest'
]));

//Run New Pod
gulp.task('create-pod', shell.task([
  'kubectl create -f k8s/node-gulp-controller.yaml',
  'kubectl create -f k8s/node-gulp-service.yaml'
]));

//Update Pod
gulp.task('update-pod', shell.task([
  'kubectl delete -f k8s/node-gulp-controller.yaml',
  'kubectl create -f k8s/node-gulp-controller.yaml'
]));
