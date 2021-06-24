
const APP_PREFIX = "FoodFest-";
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./schedule.html",
    "./tickets.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/schedules.bundle.js",
    "./dist/tickets.bundle.js"
]

//install the service worker
self.addEventListener('install', function(e){
    //Tells the brower to wait until all of the caching work is complete before termination the worker
    e.waitUntil(
        //Find the specific cache by it's name
        caches.open(CACHE_NAME)
        .then(function(cache){
            console.log('installing cache: ' + CACHE_NAME);
            //Add every file to the cache
            return cache.addAll(FILES_TO_CACHE);
        })
    )
});

//instruct the service worker how to manage caches
self.addEventListener('activate', function(e){
    e.waitUntil(
        //returns an array of all cache names
        caches.keys()
        .then(function(keyList){

            //filter out caches that don't have our app's prefix
            let cacheKeepList = keyList.filter(key => key.indexOf(APP_PREFIX));
            //push the new cache into the cache list
            cacheKeepList.push(CACHE_NAME);

            //return a promise that resolves once all old caches have been deleted
            return Promise.all(keyList.map(function(key, i){
                if(cacheKeepList.indexOf(key) === -1){
                    console.log('deleting cache: ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    )
});

//retrieve information from the cache
self.addEventListener('fetch', function(e){
    //listn for the fetch event and log the request source
    console.log('fetch request: ' + e.request.url)

    //intercept the fetch request
    e.respondWith(
        caches.match(e.request)
        .then(function(request){
            if(request){
                //if the file already exists then we will return the requested resource
                console.log('responding with cache: ' + e.request.url);
                return request;
            }
            else{
                //if the file is not stored in cache then the service worker will make a normal call for the resource
                console.log('file is not cached, fetching: ' + e.request.url);
                return fetch(e.request);
            }

            //we can omit the if/else statement in favour of the code below
            //return request || fetch(e.request);
        })
    )
})