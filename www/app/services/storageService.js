angular.module('kosmoramaApp').service('storageService', function($http) {
   
   this.setKey = function(key,value) {
       return window.localStorage.setItem(key, value);
   }
   
   this.getKey = function(key) {
       return window.localStorage.getItem(key);
   }
   
   this.destroy = function(key) {
       return window.localStorage.removeItem(key);
   }
    
});